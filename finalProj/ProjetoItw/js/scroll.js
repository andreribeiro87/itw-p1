$(document).scroll(function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    // console.log('scrollTop', scrollTop)
    // console.log('scrollHeight', scrollHeight)
    // console.log('clientHeight', clientHeight)


    if (scrollTop + clientHeight >= scrollHeight) {
        var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=${self.currentPage()}&pagesize=25`;
        console.log(self.totalPages(), 'totalPages')
        console.log(self.currentPage(), 'currentPage')

        if (self.totalPages() === self.currentPage()) {
            console.log('end')
            return;
        }
        console.log('self.currentPage()=', self.currentPage())
        setTimeout(async () => {
            showLoading()
            self.activate(self.currentPage() + 1)

        }, 1);
        self.currentPage() + 1;

    }
}),
//-----Scroll Infinite 10000};
{
    passive: true
}