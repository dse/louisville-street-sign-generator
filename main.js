function StreetSignGenerator(element) {
    this.element = element;

    this.inputs = {};
    this.inputs.blankSize   = this.element.querySelector('[data-blank-size]');
    this.inputs.direction   = this.element.querySelector('[data-street-direction-input]');
    this.inputs.name        = this.element.querySelector('[data-street-name-input]');
    this.inputs.designator  = this.element.querySelector('[data-street-designator-input]');
    this.inputs.blockNumber = this.element.querySelector('[data-street-block-number-input]');
    this.inputs.smallText   = this.element.querySelector('[data-street-small-text-checkbox]');
    this.inputs.seriesA     = this.element.querySelector('[data-street-series-a-checkbox]');
    this.inputs.tracking    = this.element.querySelector('[data-street-name-tracking]');

    this.outputs = {};
    this.outputs.direction   = this.element.querySelector('[data-street-direction-output]');
    this.outputs.name        = this.element.querySelector('[data-street-name-output]');
    this.outputs.designator  = this.element.querySelector('[data-street-designator-output]');
    this.outputs.blockNumber = this.element.querySelector('[data-street-block-number-output]');

    this.elements = {};
    this.elements.streetSign = this.element.querySelector('[data-street-sign]');

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
    this.inputs.seriesA.addEventListener('change', this.updateFromForm.bind(this));

    this.inputs.tracking.addEventListener('input', this.updateFromForm.bind(this));
    this.inputs.tracking.addEventListener('change', this.updateFromForm.bind(this));

    this.element.addEventListener('click', function (event) {
        var thingy = event.target.closest('[data-street-sign-example]');
        if (!thingy) { return; }
        event.preventDefault();
        var json = thingy.getAttribute('data-street-sign-example');
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
        var seriesA     = this.inputs.seriesA.checked;
        var tracking    = this.inputs.tracking.value;

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
        this.element.querySelector('[data-street-direction]').style.display = hasDirection ? '' : 'none';
        this.outputs.name.innerHTML = name;
        this.outputs.name.style.letterSpacing = (tracking * -0.05) + 'em';
        this.outputs.designator.innerHTML = designator;
        this.outputs.blockNumber.innerHTML = blockNumber;

        if (/\S/.test(String(blockNumber))) {
            this.elements.streetSign.classList.remove('street-sign--with-no-block-number');
        } else {
            this.elements.streetSign.classList.add('street-sign--with-no-block-number');
        }

        this.elements.streetSign.classList[smallText ? 'add' : 'remove']('street-sign--small-text');
        this.elements.streetSign.classList[seriesA ? 'add' : 'remove']('street-sign--series-a');
        this.elements.streetSign.classList[hasDirection ? 'add' : 'remove']('street-sign--with-direction');
        this.elements.streetSign.classList[hasDirection ? 'remove' : 'add']('street-sign--without-direction');
        if (hasDirection) {
            if (direction.length === 1) {
                this.outputs.direction.classList.add('street-sign__direction--1-character');
                this.outputs.direction.classList.remove('street-sign__direction--2-character');
            } else if (direction.length === 2) {
                this.outputs.direction.classList.remove('street-sign__direction--1-character');
                this.outputs.direction.classList.add('street-sign__direction--2-character');
            }
        } else {
            this.outputs.direction.classList.remove('street-sign__direction--1-character');
            this.outputs.direction.classList.remove('street-sign__direction--2-character');
        }
        [18, 21, 24, 27, 30, 33, 36, 39, 42].forEach(function (blankSizeOption) {
            this.elements.streetSign.classList[blankSize === blankSizeOption ? 'add' : 'remove'](
                'street-sign--blank-size-' + blankSizeOption
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
        this.inputs.seriesA.checked = !!this.data.seriesA;
    },
    saveData: function () {
        var blankSize = this.inputs.blankSize.options[this.inputs.blankSize.selectedIndex].value;
        var direction = this.inputs.direction.options[this.inputs.direction.selectedIndex].value;
        var name = this.inputs.name.value;
        var designator = this.inputs.designator.value;
        var blockNumber = this.inputs.blockNumber.value;
        var smallText = this.inputs.smallText.checked;
        var seriesA = this.inputs.seriesA.checked;
        if (!this.data) {
            this.data = {};
        }
        this.data.blankSize = blankSize;
        this.data.direction = direction;
        this.data.name = name;
        this.data.designator = designator;
        this.data.blockNumber = blockNumber;
        this.data.smallText = smallText;
        this.data.seriesA = seriesA;
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
