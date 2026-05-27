/* global MathQuill */
(() => {
	const MQ = MathQuill.getInterface();
	const textInput = document.getElementById('AnSwEr0001');
	const latexInput = document.getElementById('MaThQuIlL_AnSwEr0001');
	const answerQuill = document.getElementById('mq-answer-AnSwEr0001');

	const cfg = {
		enableSpaceNavigation: true,
		leftRightIntoCmdGoes: 'up',
		restrictMismatchedBrackets: true,
		sumStartsWithNEquals: true,
		supSubsRequireOperand: true,
		autoSubscriptNumerals: false,
		typingSlashWritesDivisionSymbol: false,
		typingAsteriskWritesTimesSymbol: false,
		autoCommands:
			'pi sqrt root vert inf union abs deg AA angstrom ln log exp ' +
			['sin', 'cos', 'tan', 'sec', 'csc', 'cot']
				.reduce((a, t) => a.concat([t, `arc${t}`, `a${t}`]), [])
				.join(' '),
		rootsAreExponents: true,
		logsChangeBase: true,
		useToolbar: true
	};

	const mathField = MQ.MathField(answerQuill, {
		...cfg,
		maxDepth: 10,
		handlers: {
			edit: (mq) => {
				if (mq.text() !== '') {
					textInput.value = mq.text();
					latexInput.value = mq.latex();
				} else {
					textInput.value = '';
					latexInput.value = '';
				}
			}
		}
	});
	mathField.latex(latexInput.value);
	mathField.moveToLeftEnd();
	mathField.blur();

	mathField.options.addToolbarButtons(
		{
			id: 'subscript',
			latex: '_',
			tooltip: 'subscript (_)',
			icon: '\\text{  }_\\text{  }'
		},
		'exponent'
	);

	const optionsContainer = document.querySelector('.options-container');

	for (const option in cfg) {
		const optionDiv = document.createElement('div');
		optionDiv.classList.add('form-check');
		if (typeof cfg[option] === 'boolean') {
			const input = document.createElement('input');
			input.type = 'checkbox';
			input.id = option;
			input.classList.add('form-check-input');
			if (cfg[option]) input.checked = true;
			const label = document.createElement('label');
			label.setAttribute('for', option);
			label.textContent = `Enable ${option}`;
			label.classList.add('form-check-label');
			optionDiv.append(input, label);
			optionsContainer.append(optionDiv);
			input.addEventListener('change', () => {
				mathField.options[option] = input.checked;
				mathField.reflow();
			});
		}
	}

	// Special case for leftRightIntoCmdGoes
	{
		const optionDiv = document.createElement('div');
		optionDiv.classList.add('d-flex', 'gap-3');
		const inputGroupLabel = document.createElement('span');
		inputGroupLabel.textContent = 'leftRightIntoCmdGoes: ';
		const radioGroupContainer = document.createElement('div');
		const upInputContainer = document.createElement('div');
		upInputContainer.classList.add('form-check', 'form-check-inline');
		const upInput = document.createElement('input');
		upInput.type = 'radio';
		upInput.name = 'leftRightIntoCmdGoes';
		upInput.id = 'leftRightIntoCmdGoes_up';
		upInput.checked = true;
		upInput.classList.add('form-check-input');
		const upLabel = document.createElement('label');
		upLabel.setAttribute('for', 'leftRightIntoCmdGoes_up');
		upLabel.textContent = 'up';
		upLabel.classList.add('form-check-label');
		upInputContainer.append(upInput, upLabel);
		const downInputContainer = document.createElement('div');
		downInputContainer.classList.add('form-check', 'form-check-inline');
		const downInput = document.createElement('input');
		downInput.type = 'radio';
		downInput.name = 'leftRightIntoCmdGoes';
		downInput.id = 'leftRightIntoCmdGoes_down';
		downInput.classList.add('form-check-input');
		const downLabel = document.createElement('label');
		downLabel.setAttribute('for', 'leftRightIntoCmdGoes_down');
		downLabel.textContent = 'down';
		downLabel.classList.add('form-check-label');
		downInputContainer.append(downInput, downLabel);
		radioGroupContainer.append(upInputContainer, downInputContainer);
		optionDiv.append(inputGroupLabel, radioGroupContainer);
		optionsContainer.append(optionDiv);
		upInput.addEventListener('click', () => (mathField.options.leftRightIntoCmdGoes = 'up'));
		downInput.addEventListener('click', () => (mathField.options.leftRightIntoCmdGoes = 'down'));
	}

	// Special case for autoCommands
	{
		const optionDiv = document.createElement('div');
		optionDiv.classList.add('auto-options');
		const optionLabel = document.createElement('label');
		optionLabel.textContent = 'autoCommands:';
		optionLabel.setAttribute('for', 'currentAutoCommands');
		const optionSelect = document.createElement('select');
		optionSelect.id = 'currentAutoCommands';
		optionSelect.name = 'currentAutoCommands';
		optionSelect.multiple = 'true';
		optionSelect.size = '10';
		optionSelect.classList.add('form-select');

		for (const cmd of Object.keys(mathField.options.autoCommands).sort()) {
			if (cmd === '_maxLength') continue;
			const cmdOption = document.createElement('option');
			cmdOption.value = cmd;
			cmdOption.textContent = cmd;
			optionSelect.add(cmdOption);
		}

		const deleteButton = document.createElement('button');
		deleteButton.type = 'button';
		deleteButton.textContent = 'Delete Selected';
		deleteButton.classList.add('btn', 'btn-primary');
		deleteButton.addEventListener('click', () => {
			for (const cmd of Array.from(optionSelect.selectedOptions)) {
				mathField.options.removeAutoCommands(cmd.value);
				cmd.remove();
			}
		});

		const optionInput = document.createElement('input');
		optionInput.type = 'text';
		optionInput.name = 'add-auto-command';

		const addButton = document.createElement('button');
		addButton.type = 'button';
		addButton.textContent = 'Add Command';
		addButton.classList.add('btn', 'btn-primary');
		addButton.addEventListener('click', () => {
			try {
				mathField.options.addAutoCommands(optionInput.value);
			} catch (e) {
				alert(e);
				return;
			}
			const cmdOption = document.createElement('option');
			cmdOption.value = optionInput.value.trim();
			cmdOption.textContent = optionInput.value.trim();
			let added = false;
			for (const opt of optionSelect.options) {
				if (cmdOption.value === opt.value) {
					added = true;
					alert('This command has already been added.');
					break;
				} else if (cmdOption.value < opt.value) {
					added = true;
					optionSelect.add(cmdOption, opt);
					break;
				}
			}
			if (!added) optionSelect.add(cmdOption);
			optionInput.value = '';
		});

		optionDiv.append(optionLabel, optionSelect, deleteButton, optionInput, addButton);
		optionsContainer.append(optionDiv);
	}

	// Special case for autoOperatorNames
	{
		const optionDiv = document.createElement('div');
		optionDiv.classList.add('auto-options');
		const optionLabel = document.createElement('label');
		optionLabel.textContent = 'autoOperatorNames:';
		optionLabel.setAttribute('for', 'currentAutoOperatorNames');
		const optionSelect = document.createElement('select');
		optionSelect.id = 'currentAutoOperatorNames';
		optionSelect.name = 'currentAutoOperatorNames';
		optionSelect.multiple = 'true';
		optionSelect.size = '10';
		optionSelect.classList.add('form-select');

		for (const cmd of Object.keys(mathField.options.autoOperatorNames).sort()) {
			if (cmd === '_maxLength') continue;
			const cmdOption = document.createElement('option');
			cmdOption.value = cmd;
			cmdOption.textContent = cmd;
			optionSelect.add(cmdOption);
		}

		const deleteButton = document.createElement('button');
		deleteButton.type = 'button';
		deleteButton.textContent = 'Delete Selected';
		deleteButton.classList.add('btn', 'btn-primary');
		deleteButton.addEventListener('click', () => {
			for (const cmd of Array.from(optionSelect.selectedOptions)) {
				mathField.options.removeAutoOperatorNames(cmd.value);
				cmd.remove();
			}
		});

		const optionInput = document.createElement('input');
		optionInput.type = 'text';
		optionInput.name = 'add-auto-operator-name';

		const addButton = document.createElement('button');
		addButton.type = 'button';
		addButton.textContent = 'Add Operator Name';
		addButton.classList.add('btn', 'btn-primary');
		addButton.addEventListener('click', () => {
			try {
				mathField.options.addAutoOperatorNames(optionInput.value);
			} catch (e) {
				alert(e);
				return;
			}
			const cmdOption = document.createElement('option');
			cmdOption.value = optionInput.value.trim();
			cmdOption.textContent = optionInput.value.trim();
			let added = false;
			for (const opt of optionSelect.options) {
				if (cmdOption.value === opt.value) {
					added = true;
					alert('This operator name has already been added.');
					break;
				} else if (cmdOption.value < opt.value) {
					added = true;
					optionSelect.add(cmdOption, opt);
					break;
				}
			}
			if (!added) optionSelect.add(cmdOption);
			optionInput.value = '';
		});

		optionDiv.append(optionLabel, optionSelect, deleteButton, optionInput, addButton);
		optionsContainer.append(optionDiv);
	}
})();
