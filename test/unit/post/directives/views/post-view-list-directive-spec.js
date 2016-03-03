var ROOT_PATH = '../../../../../';

describe('post view list directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;
    var mockEvent = {
        preventDefault: function () {}
    };

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postViewList', require(ROOT_PATH + 'app/post/directives/views/post-view-list-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        $scope.isLoading = true;
        $scope.filters = {};
        element = '<post-view-list filters="filters" is-loading="isLoading"></post-view-list>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load initial values', function () {
        expect(isolateScope.currentPage).toEqual(1);
    });

    it('should update the number of items per page', function () {
        isolateScope.itemsPerPageChanged(1);
        expect(isolateScope.itemsPerPage).toEqual(1);
    });

    it('should check if the user has bulk action permissions', function () {
        var result = isolateScope.userHasBulkActionPermissions();
        expect(result).toBe(true);
    });

    it('should select and unselect all posts', function () {
        isolateScope.selectAllPosts(mockEvent);

        expect(isolateScope.posts[0].selected).toBe(true);

        isolateScope.unselectAllPosts(mockEvent);

        expect(isolateScope.posts[0].selected).toBe(false);
    });

    it('should check if all the posts of the current page are selected', function () {
        isolateScope.selectAllPosts(mockEvent);
        var result = isolateScope.allSelectedOnCurrentPage(mockEvent);
        expect(result).toBe(true);
    });

    it('should check if filters have been set', function () {
        isolateScope.filters = {
            status: 'all'
        };

        var result = isolateScope.hasFilters();
        expect(result).toBe(false);
    });

    it('should delete selected posts', function () {
        spyOn(Notify, 'showNotificationSlider');
        isolateScope.posts[0].id = 'pass';
        isolateScope.selectAllPosts(mockEvent);

        isolateScope.deleteSelectedPosts();

        $rootScope.$digest();
        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });
});
