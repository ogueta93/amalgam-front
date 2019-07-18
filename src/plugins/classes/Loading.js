export default {
    app: null,
    options: null,
    translator: null,
    defaultLocation: "#app",
    textPrefix: 'loading.messages.',
    loadingElements: [],

    getTemplate: function(text) {
        return "<div class='loading-content'><div class='loading-symbol'>"
        + "<div class='spinner-grow loading-spinner'></div>"
        + "</div><div class='loading-text'>"+ this.translator.t(text) +"</div></div>";
    },
    appendLoading: function(loadingName) {
        var loading = this.findLoadingByName(loadingName);

        var target = document.querySelector(loading.selector);
        if (target) {
            target.insertAdjacentHTML('afterbegin', this.getTemplate(loading.text));
        }

        if (target && (loading.selector !== this.defaultLocation)) {
            var elLoading = target.children[0];

            elLoading.style.height = target.offsetHeight.toString() + 'px';
            elLoading.style.width = target.offsetWidth.toString() + 'px';
            elLoading.style.zIndex = 1;
        }  
    },
    findLoadingByName: function(loadingName) {
        var loading = this.loadingElements.filter(function(obj){
            if (obj.name === loadingName) {
                return obj;
            }
        });

        return loading[0];
    },
    removeLoadingByName: function(loadingName) {
        for (var i = 0 ; i < this.loadingElements.length; i++)
        {
            if(this.loadingElements[i].name === loadingName) {
                this.loadingElements.splice(i);
                return;
            }
        }
    },
    start: function(loadingName, selector, text) {
        if (this.translator === null) {
            this.translator = this.app.$i18n;
        }

        var currentLoading = document.querySelector('.loading-content');
        if (currentLoading) {
            this.clean()
        }
        
        if (selector === undefined || selector === null) {
            selector = this.defaultLocation;
        }

        text = text === undefined ? this.textPrefix + 'default' : this.textPrefix + text;

        this.loadingElements.push({
            selector: selector,
            name: loadingName,
            text: text
        });

        this.appendLoading(loadingName);
    },
    end: function(loadingName) {
        var loading = this.findLoadingByName(loadingName);

        if (loading) {
            var target = document.querySelector(loading.selector);
            target.querySelector('.loading-content').remove();
        }

        this.removeLoadingByName(loadingName);
    },
    clean: function() {
        this.loadingElements = [];
        var loadingEl = document.querySelector('.loading-content');
        if (loadingEl) {
            loadingEl.remove();
        }
    }
}
