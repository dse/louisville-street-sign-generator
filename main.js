function StreetSignGenerator(element, form) {
    if (form == null) {
        this.element = element;
    } else {
        this.element = element;
        this.form = form;
    }
    if (this.form == null) {
        this.form = this.element;
    }

    this.inputs = {};
    this.inputs.blankSize      = this.form.querySelector('[data-ss-blank-size-input]');
    this.inputs.direction      = this.form.querySelector('[data-ss-direction-input]');
    this.inputs.name           = this.form.querySelector('[data-ss-name-input]');
    this.inputs.designator     = this.form.querySelector('[data-ss-designator-input]');
    this.inputs.blockNumber    = this.form.querySelector('[data-ss-block-number-input]');
    this.inputs.smallText      = this.form.querySelector('[data-ss-small-text-checkbox]');
    this.inputs.streetNameFont = this.form.querySelector('[data-ss-street-name-font-input]');
    this.inputs.tracking       = this.form.querySelector('[data-ss-name-tracking]');

    this.outputs = {};
    this.outputs.direction   = this.element.querySelector('[data-ss-direction-output]');
    this.outputs.name        = this.element.querySelector('[data-ss-name-output]');
    this.outputs.designator  = this.element.querySelector('[data-ss-designator-output]');
    this.outputs.blockNumber = this.element.querySelector('[data-ss-block-number-output]');

    this.elements = {};
    if (this.element.matches('[data-ss]')) {
        this.elements.streetSign = this.element;
    } else {
        this.elements.streetSign = this.element.querySelector('[data-ss]');
    }

    this.loadData();
    if (this.data) {
        this.updateFormFromData();
        this.updateFromForm();
    } else {
        this.updateFromForm();
    }

    this.inputs.blankSize.addEventListener('change', this.updateFromForm.bind(this));
    this.inputs.direction.addEventListener('change', this.updateFromForm.bind(this));
    this.inputs.name.addEventListener('keypress', this.updateFromForm.bind(this));
    this.inputs.name.addEventListener('keydown', this.updateFromForm.bind(this));
    this.inputs.name.addEventListener('keyup', this.updateFromForm.bind(this));
    this.inputs.name.addEventListener('change', this.updateFromForm.bind(this));
    this.inputs.designator.addEventListener('keypress', this.updateFromForm.bind(this));
    this.inputs.designator.addEventListener('keydown', this.updateFromForm.bind(this));
    this.inputs.designator.addEventListener('keyup', this.updateFromForm.bind(this));
    this.inputs.designator.addEventListener('change', this.updateFromForm.bind(this));
    this.inputs.blockNumber.addEventListener('keypress', this.updateFromForm.bind(this));
    this.inputs.blockNumber.addEventListener('keydown', this.updateFromForm.bind(this));
    this.inputs.blockNumber.addEventListener('keyup', this.updateFromForm.bind(this));
    this.inputs.blockNumber.addEventListener('change', this.updateFromForm.bind(this));
    this.inputs.smallText.addEventListener('change', this.updateFromForm.bind(this));
    this.inputs.streetNameFont.addEventListener('change', this.updateFromForm.bind(this));

    this.inputs.tracking.addEventListener('input', this.updateFromForm.bind(this));
    this.inputs.tracking.addEventListener('change', this.updateFromForm.bind(this));

    this.form.addEventListener('click', function (event) {
        var thingy = event.target.closest('[data-ss-example]');
        if (!thingy) { return; }
        event.preventDefault();
        var json = thingy.getAttribute('data-ss-example');
        var o = JSON.parse(json);
        this.data = o;
        this.updateFormFromData();
        this.updateFromForm();
        this.saveData();
    }.bind(this));
}
Object.assign(StreetSignGenerator.prototype, {
    updateFromForm: function () {
        var blankSize   = Number(this.inputs.blankSize.options[this.inputs.blankSize.selectedIndex].value);
        var direction   = this.inputs.direction.options[this.inputs.direction.selectedIndex].value;
        var name        = this.inputs.name.value.trim().toUpperCase();
        var designator  = this.inputs.designator.value.toUpperCase();
        var blockNumber = this.inputs.blockNumber.value;
        var smallText   = this.inputs.smallText.checked;
        var streetNameFont = this.inputs.streetNameFont.options[this.inputs.streetNameFont.selectedIndex].value;
        var tracking       = this.inputs.tracking.value;

        if (!/\S/.test(designator)) {
            designator = "\u00a0";
        }

        if (/^MC/.test(name)) {
            name = 'Mc' + name.slice(2);
        }
        var matches;
        if ((matches = /^(.*)(\d+)(ST|ND|RD|TH)(?=$|\s)(.*)$/.exec(name))) {
            name = matches[1] + matches[2] + '<sup>' + matches[3] + '</sup>' + matches[4];
        }

        var hasDirection = /\S/.test(direction);

        this.outputs.direction.innerHTML = direction;
        this.element.querySelector('[data-ss-direction]').style.display = hasDirection ? '' : 'none';
        this.outputs.name.innerHTML = name;
        this.outputs.name.style.letterSpacing = (tracking * -0.05) + 'em';
        this.outputs.designator.innerHTML = designator;
        this.outputs.blockNumber.innerHTML = blockNumber;

        if (/\S/.test(String(blockNumber))) {
            this.elements.streetSign.classList.remove('ss--with-no-block-number');
        } else {
            this.elements.streetSign.classList.add('ss--with-no-block-number');
        }

        this.elements.streetSign.classList[smallText ? 'add' : 'remove']('ss--small-text');
        this.elements.streetSign.classList[streetNameFont === 'series-a' ? 'add' : 'remove']('ss--series-a');
        this.elements.streetSign.classList[streetNameFont === 'series-b' ? 'add' : 'remove']('ss--series-b');
        this.elements.streetSign.classList[streetNameFont === 'series-c' ? 'add' : 'remove']('ss--series-c');
        this.elements.streetSign.classList[streetNameFont === 'series-d' ? 'add' : 'remove']('ss--series-d');
        this.elements.streetSign.classList[hasDirection ? 'add' : 'remove']('ss--with-direction');
        this.elements.streetSign.classList[hasDirection ? 'remove' : 'add']('ss--without-direction');
        if (hasDirection) {
            if (direction.length === 1) {
                this.outputs.direction.classList.add('ss__direction--1-character');
                this.outputs.direction.classList.remove('ss__direction--2-character');
            } else if (direction.length === 2) {
                this.outputs.direction.classList.remove('ss__direction--1-character');
                this.outputs.direction.classList.add('ss__direction--2-character');
            }
        } else {
            this.outputs.direction.classList.remove('ss__direction--1-character');
            this.outputs.direction.classList.remove('ss__direction--2-character');
        }
        [18, 21, 24, 27, 30, 33, 36, 39, 42].forEach(function (blankSizeOption) {
            this.elements.streetSign.classList[blankSize === blankSizeOption ? 'add' : 'remove'](
                'ss--blank-size-' + blankSizeOption
            );
        }.bind(this));
        this.saveData();
    },
    loadData: function () {
        this.data = JSON.parse(localStorage.getItem('streetSign'));
        console.log(this.data);
    },
    updateFormFromData: function () {
        this.setSelectValue(this.inputs.blankSize, this.data.blankSize);
        this.setSelectValue(this.inputs.direction, this.data.direction);
        this.inputs.name.value = this.data.name;
        this.inputs.designator.value = this.data.designator;
        this.inputs.blockNumber.value = this.data.blockNumber;
        this.inputs.smallText.checked = !!this.data.smallText;
        this.setSelectValue(this.inputs.streetNameFont, this.data.streetNameFont);
    },
    saveData: function () {
        var blankSize = this.inputs.blankSize.options[this.inputs.blankSize.selectedIndex].value;
        var direction = this.inputs.direction.options[this.inputs.direction.selectedIndex].value;
        var name = this.inputs.name.value;
        var designator = this.inputs.designator.value;
        var blockNumber = this.inputs.blockNumber.value;
        var smallText = this.inputs.smallText.checked;
        var streetNameFont = this.inputs.streetNameFont.options[this.inputs.streetNameFont.selectedIndex].value;
        if (!this.data) {
            this.data = {};
        }
        this.data.blankSize = blankSize;
        this.data.direction = direction;
        this.data.name = name;
        this.data.designator = designator;
        this.data.blockNumber = blockNumber;
        this.data.smallText = smallText;
        this.data.streetNameFont = streetNameFont;
        localStorage.setItem('streetSign', JSON.stringify(this.data));
    },
    setSelectValue: function (select, value) {
        var options = Array.from(select.options).map(function (option) {
            return option.value;
        });
        var index = options.indexOf(value);
        var newOption;
        if (index === -1) {
            newOption = document.createElement('option');
            newOption.value = value;
            select.appendChild(newOption);
            select.selectedIndex = options.length;
        } else {
            select.selectedIndex = index;
        }
    },
});
