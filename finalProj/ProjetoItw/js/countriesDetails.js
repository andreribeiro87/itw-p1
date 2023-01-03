// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Countries/');
    self.displayName = 'Olympic Games edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.ModalityId = ko.observable('');
    self.Flag = ko.observable('');
    self.Participant = ko.observableArray([]);
    self.Events = ko.observableArray([]);
    self.Photo = ko.observable('');
    self.IOC = ko.observable('');
    self.Url = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getGame...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.ModalityId(data.ModalityId);
            self.Flag(data.Flag);
            self.Photo(data.Photo);
            self.Participant(data.Participant);
            self.Events(data.Events);
            self.IOC(data.IOC);

        });
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

    function showLoading() {
        $('#myModal').modal('show', {
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

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    $('#searchAll').autocomplete({
        // source: self.availableTags(),
        max: 50,
        minLength: 3,
        source:
            function (request, response) {
                $.ajax({
                    type: "GET",
                    url: `http://192.168.160.58/Olympics/api/Utils/Search?`,
                    data: {
                        q: $('#searchAll').val()
                    },
                    success: function (data) {

                        if (!data.length) {
                            var result = [{
                                label: 'No matches found',
                                value: response.term
                            }];
                            response(result);
                        } else {

                            var nData = $.map(data, function (value, key) {
                                return {
                                    label: value.Name,
                                    value: value.Name
                                }
                            });
                            results = $.ui.autocomplete.filter(nData, request.term);
                            response(results.slice(0, 20));
                        }
                    },
                    error: function () {
                        alert("error!");
                    }
                })
            },

    });
    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};


$(document).ready(function () {
    console.log("document.ready!");
    $(window).scroll(function () {
        // End of the document reached?
        if ($(document).height() - $(this).height() == $(this).scrollTop()) {
            console.log("middle of the document reached!");
            alert('Scrolled to Bottom');
        }
    });
    ko.applyBindings(new vm());
});


$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})