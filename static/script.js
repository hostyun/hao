!function () {
    function initialize() {
        updateNewWindowSetting();
        updateSearchType();
        updatePlaceholder();
        updateFormAction();
    }

    function updateNewWindowSetting() {
        newWindowCheckbox.checked = getNewWindowSetting();
    }

    function updateSearchType() {
        const selectedTypeInput = document.querySelector('input[name="type"][value="' + getStoredType() + '"]');
        if (selectedTypeInput) {
            selectedTypeInput.checked = true;
            highlightSelectedType(selectedTypeInput);
        }
    }

    function updatePlaceholder() {
        setPlaceholder(getPlaceholder());
    }

    function updateFormAction() {
        setFormAction(getAction());
    }

    function highlightSelectedType(inputElement) {
        searchGroups.forEach(group => group.classList.remove("s-current"));
        inputElement.closest(".search-group").classList.add("s-current");
    }

    function storeSetting(key, value) {
        try {
            window.localStorage.setItem("superSearch" + key, value);
        } catch (e) {
            console.warn("localStorage not available", e);
        }
    }

    function getStoredSetting(key) {
        try {
            return window.localStorage.getItem("superSearch" + key);
        } catch (e) {
            console.warn("localStorage not available", e);
            return null;
        }
    }

    function handleTypeChange(event) {
        const newType = event.target;
        setPlaceholder(getPlaceholder());
        setFormAction(newType.value);
        storeSetting("type", newType.value);
        searchInput.focus();
        highlightSelectedType(newType);
    }

    function getStoredType() {
        const storedType = getStoredSetting("type");
        return storedType || searchTypeInputs[0].value;
    }

    function handleNewWindowChange(event) {
        storeSetting("newWindow", event.target.checked ? 1 : -1);
        updateFormTarget(event.target.checked);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        if (searchInput.value === "") {
            searchInput.focus();
            return false;
        } else {
            setFormAction(getAction() + searchInput.value);
            updateFormTarget(getNewWindowSetting());
            if (getNewWindowSetting()) {
                window.open(searchForm.action, +new Date());
            } else {
                location.href = searchForm.action;
            }
            return false;
        }
    }

    function getNewWindowSetting() {
        const setting = getStoredSetting("newWindow");
        return setting ? setting === "1" : true;
    }

    function getAction() {
        return document.querySelector('input[name="type"]:checked').value;
    }

    function getPlaceholder() {
        return document.querySelector('input[name="type"]:checked').getAttribute("data-placeholder");
    }

    function setPlaceholder(placeholder) {
        searchInput.setAttribute("placeholder", placeholder);
    }

    function setFormAction(action) {
        searchForm.action = action;
    }

    function updateFormTarget(openInNewWindow) {
        searchForm.target = openInNewWindow ? "_blank" : "";
    }

    const searchTypeInputs = document.querySelectorAll('input[name="type"]');
    const searchForm = document.querySelector("#super-search-fm");
    const searchInput = document.querySelector("#search-text");
    const newWindowCheckbox = document.querySelector("#set-search-blank");
    const searchGroups = document.querySelectorAll(".search-group");

    initialize();

    searchTypeInputs.forEach(input => {
        input.addEventListener("change", handleTypeChange);
    });

    newWindowCheckbox.addEventListener("change", handleNewWindowChange);

    searchForm.addEventListener("submit", handleFormSubmit);
}();
