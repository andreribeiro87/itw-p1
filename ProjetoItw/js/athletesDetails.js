// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Athletes/');
    self.displayName = 'Olympic Games edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Sex = ko.observable('');
    self.Height = ko.observable('');
    self.Photo = ko.observable('');
    self.Weight = ko.observable('');
    self.BornDate = ko.observableArray('');
    self.BornPlace = ko.observableArray('');
    self.DiedDate = ko.observableArray('');
    self.OlympediaLink = ko.observableArray('');
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
            self.Sex(data.Sex);
            self.Height(data.Height);
            self.Photo(data.Photo);
            self.Weight(data.Weight);
            self.BornDate(data.BornDate);
            self.BornPlace(data.BornPlace);
            self.DiedDate(data.DiedDate);
            self.OlympediaLink(data.OlympediaLink);
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
    ko.applyBindings(new vm());
});
$(document).ready(function () {

    $(".showModal").on('load', function () {
        var url = $(this).find("img").attr("src");
        console.log(url, 'URL');
        $("#ModalI img").attr("src", url);
        $("#ModalImages").modal("show");
    });
});



$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});