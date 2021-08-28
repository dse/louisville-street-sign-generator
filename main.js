function StreetSignGenerator(element) {
    this.element = element;
    if (typeof element === 'string') {
        this.element = document.getElementById(element);
        if (!this.element) {
            console.error('no such element:', element);
            return;
        }
    }
    this.inputs = {};
    this.inputs.direction = this.element.querySelector('[data-street-direction-input]');
    this.inputs.name = this.element.querySelector('[data-street-name-input]');
    this.inputs.designator = this.element.querySelector('[data-street-designator-input]');
    this.inputs.blockNumber = this.element.querySelector('[data-street-block-number-input]');
    this.outputs = {};
    this.outputs.direction = this.element.querySelector('[data-street-direction-output]');
    this.outputs.name = this.element.querySelector('[data-street-name-output]');
    this.outputs.designator = this.element.querySelector('[data-street-designator-output]');
    this.outputs.blockNumber = this.element.querySelector('[data-street-block-number-output]');

    this.loadData();
    if (this.data) {
        this.updateFormFromData();
        this.updateFromForm();
    } else {
        this.updateFromForm();
    }

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
}
Object.assign(StreetSignGenerator.prototype, {
    updateFromForm: function () {
        var direction = this.inputs.direction.options[this.inputs.direction.selectedIndex].value;
        var name = this.inputs.name.value.trim().toUpperCase();
        var designator = this.inputs.designator.value.toUpperCase();
        var blockNumber = this.inputs.blockNumber.value;
        if (!blockNumber) {
            blockNumber = "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a000";
        }

        var matches;
        if (/^MC/.test(name)) {
            name = 'Mc' + name.slice(2);
        }
        if ((matches = /^(.*)(\d+)(ST|ND|RD|TH)$/.exec(name))) {
            name = matches[1] + matches[2] + '<sup>' + matches[3] + '</sup>';
        }

        this.outputs.direction.innerHTML = direction;
        this.outputs.direction.style.display = /\S/.test(this.outputs.direction.innerHTML) ? '' : 'none';
        this.outputs.name.innerHTML = name;
        this.outputs.designator.innerHTML = designator;
        this.outputs.blockNumber.innerHTML = blockNumber;
        this.saveData();
    },
    loadData: function () {
        this.data = JSON.parse(localStorage.getItem('streetSign'));
        console.log(this.data);
    },
    updateFormFromData: function () {
        this.setSelectValue(this.inputs.direction, this.data.direction);
        this.inputs.name.value = this.data.name;
        this.inputs.designator.value = this.data.designator;
        this.inputs.blockNumber.value = this.data.blockNumber;
    },
    saveData: function () {
        var direction = this.inputs.direction.options[this.inputs.direction.selectedIndex].value;
        var name = this.inputs.name.value;
        var designator = this.inputs.designator.value;
        var blockNumber = this.inputs.blockNumber.value;
        if (!this.data) {
            this.data = {};
        }
        this.data.direction = direction;
        this.data.name = name;
        this.data.designator = designator;
        this.data.blockNumber = blockNumber;
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
