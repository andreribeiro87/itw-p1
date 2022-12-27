// ViewModel KnockOut
// debugger;
$(document).ready(function () {
    var b = 1;
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var page = b
        // self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Athletes');
        // self.composedUri = ko.observable(`http://192.168.160.58/Olympics/api/Athletes?page=${page}&pagesize=30`);
        //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
        self.displayName = 'Olympic Games editions List';
        self.error = ko.observable('');
        self.passingMessage = ko.observable('');
        self.records = ko.observableArray([]);
        self.currentPage = ko.observable(1);
        // self.pagesize = ko.observable(100);
        self.totalRecords = ko.observable();
        self.hasPrevious = ko.observable(false);
        self.hasNext = ko.observable(false);
        self.previousPage = ko.computed(function () {
            return self.currentPage() * 1 - 1;
        }, self);
        // self.nextPage = ko.computed(function () {
        //     return self.currentPage() * 1 + 1;
        // }, self);
        // self.fromRecord = ko.computed(function () {
        //     return self.previousPage() * self.pagesize() + 1;
        // }, self);
        // self.toRecord = ko.computed(function () {
        //     return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
        // }, self);
        self.totalPages = ko.observable(0);
        self.pageArray = function () {
            var list = [];
            var size = Math.min(self.totalPages(), 9);
            var step;
            if (size < 9 || self.currentPage() === 1)
                step = 0;
            else if (self.currentPage() >= self.totalPages() - 4)
                step = self.totalPages() - 9;
            else
                step = Math.max(self.currentPage() - 5, 0);

            for (var i = 1; i <= size; i++)
                list.push(i + step);
            return list;
        };

        //--- Page Events
        self.activate = function (id) {
            console.log('CALL: getGames...');

            var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=${id}&pagesize=25`;
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                hideLoading();
                (self.records).push(...data.Records);
                self.currentPage(data.CurrentPage);
                self.hasNext(data.HasNext);
                self.hasPrevious(data.HasPrevious);
                // self.pagesize(data.PageSize)
                self.totalPages(data.TotalPages);
                self.totalRecords(data.TotalRecords);
                //self.SetFavourites();
            });
            console.log(self.records())
            b++;
        };

        //--- Internal functions
        function ajaxHelper(uri, method, data) {
            self.error(''); // Clear error message
            return $.ajax({
                type: method,
                url: uri,
                dataType: 'json',
                contentType: 'application/json',
                data: data ? JSON.stringify(data) : null,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("AJAX Call[" + uri + "] Fail...");
                    hideLoading();
                    self.error(errorThrown);
                }
            });
        }

        function sleep(milliseconds) {
            const start = Date.now();
            while (Date.now() - start < milliseconds);
        }

        function showLoading() {
            $("#myModal").modal('show', {
                backdrop: 'static',
                keyboard: false
            });
        }
        function hideLoading() {
            $('#myModal').on('shown.bs.modal', function (e) {
                $("#myModal").modal('hide');
            })
        }

        function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
            console.log("sPageURL=", sPageURL);
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        };

        //--- start ....

        console.log("VM initialized!");

        $(document).scroll(function () {
            var page = 1;
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            console.log('scrollTop', scrollTop)
            console.log('scrollHeight', scrollHeight)
            console.log('clientHeight', clientHeight)
            if (scrollTop + clientHeight >= scrollHeight - 5) {

                var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=${page}&pagesize=20`;
                // var b = page++
                console.log('b=', b)
                setTimeout(async () => {
                    self.activate(b)

                }, 1000)
            }
        }),
        //-----Scroll Infinite 10000};
        {
            passive: true
        }
        showLoading();
        var pg = getUrlParameter('page');
        console.log(pg, 'pg');
        if (pg == undefined)
            self.activate(1);
        else {
            console.log(pg, 'pg');

            self.activate(pg);
        }
    };


    console.log("ready!");





    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})