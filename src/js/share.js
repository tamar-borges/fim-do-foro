$("#shares").jsSocials({
    showLabel: false,
    showCount: false,
    shares: ["facebook", "googleplus", "twitter", "whatsapp", "email"],
    on: {
        click: function () {
            ga && ga('send', 'event', 'share', this.share, window.location.pathname);
        }
    }
});
$('#shares').sticky({topSpacing: 50});
