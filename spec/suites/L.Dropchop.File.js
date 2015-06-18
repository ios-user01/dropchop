describe("L.Dropchop.FileExecute Operations", function(){
    var menu;
    var ops;
    var exampleData = true;

    // TODO: test for geojson save
    describe('Save as a geojson', function () {
        expect(exampleData).to.eql(true);
    });

    // TODO: test for shapefile save
    describe('Save as a shapefile', function () {
        expect(exampleData).to.eql(true);
    });

    describe('load from url', function () {
        var xhr, requests, getRequest, _addJsonAsLayer, fakeThis;

        beforeEach(function () {
            xhr = sinon.useFakeXMLHttpRequest();
            requests = [];
            xhr.onCreate = function (req) { requests.push(req); };

            fakeThis = {
                _addJsonAsLayer: function () {},
                getRequest: function () {}
            };
            _addJsonAsLayer = sinon.stub(fakeThis, '_addJsonAsLayer');
            getRequest = sinon.stub(fakeThis, 'getRequest');

            console.debug = sinon.stub(console, "debug");
            console.error = sinon.stub(console, "error");
        });

        afterEach(function () {
            xhr.restore();
            _addJsonAsLayer.restore();
            getRequest.restore();
            console.debug.restore();
            console.error.restore();
        });

        it('makes request', function () {
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from url', ['http://foo.com/blah.geojson'], null, null, null
            );

            expect(getRequest.calledOnce).to.equal(true);

            // Ensure that getRequest is called with a URL and callback
            var args = getRequest.firstCall.args;
            expect(args.length).to.equal(2);
            expect(args[0]).to.equal('http://foo.com/blah.geojson');
            expect(typeof args[1]).to.equal('function');
        });

        it('callback logs bad request', function () {
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from url', ['http://foo.com/blah.geojson'], null, null, null
            );

            // Ensure that when callback gets a non-200 response, error is logged
            var args = getRequest.firstCall.args;
            var ajaxCallback = args[1];
            xhr.status = 500;
            ajaxCallback(xhr)

            expect(console.error.calledOnce).to.equal(true);
            expect(console.error.firstCall.args).to.eql(['Request failed. Returned status of 500']);
        });

        it('callback creates layer from good request', function () {
            var fakeCallback = function(){};
            L.Dropchop.FileExecute.prototype.execute.bind(fakeThis)(
                'load from url', ['http://foo.com/blah.geojson'], null, null, fakeCallback
            );

            // Ensure that when callback gets a 200 response, adds data as layer
            var args = getRequest.firstCall.args;
            var ajaxCallback = args[1];
            xhr.status = 200;
            xhr.responseURL = 'http://foo.com/blah.geojson';
            xhr.responseText = "some geojson data goes here";
            ajaxCallback.bind(fakeThis)(xhr)

            expect(_addJsonAsLayer.calledOnce).to.equal(true);
            expect(_addJsonAsLayer.firstCall.args).to.eql(['some geojson data goes here', 'blah.geojson', fakeCallback]);
        });

    });

    describe('load from gist', function () {

    });

    describe('getRequest', function () {

    });

    describe('_addJsonAsLayer', function () {
        // TODO: This should be tested heavily
    });
});