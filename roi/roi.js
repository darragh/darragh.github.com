function getInputValue(id) {
    return parseInt(document.getElementById(id).value, 10);
}

function calculate() {
    const conversationVolume = getInputValue('conversationVolumeInput');
    const supportTeamSize = getInputValue('supportTeamSizeInput');
    const resolutionRate = getInputValue('resolutionRateInput');
    const involvementRate = getInputValue('involvementRateInput');
    const averageMonthlyCostPerEmployee = getInputValue('averageMonthlyCostPerEmployeeInput');
    const anticipatedYearOverYearGrowthRate = getInputValue('anticipatedYearOverYearGrowthRateInput');
    const anticipatedCopilotEfficiency = getInputValue('anticipatedCopilotEfficiencyInput');
    const ratioOfFinConversationTimeVsHuman = 0.33;
    const costPerResolution = 0.99;


    const resolvedConversationsMonthly = conversationVolume * (resolutionRate/100.0) * (involvementRate/100.0);
    const totalEmployeeHours = supportTeamSize * (40 * 4);
    const humanWeightedResolutions = (conversationVolume - resolvedConversationsMonthly) / ratioOfFinConversationTimeVsHuman;
    const monthlyHoursSavedEstimate = totalEmployeeHours * (resolvedConversationsMonthly/(resolvedConversationsMonthly+humanWeightedResolutions));
    // rough modelling - https://docs.google.com/spreadsheets/d/1QprxDyqQCCnXLw3kqP-3HiRnj9SFaXUtuvyzpHbnc8E/edit#gid=0
    // really dumb model - just assumes fin handled would take a human ratioOfFinConversationTimeVsHuman amount of time vs the ones find doesn't handle

    const percentageTeamSavings = 100 * (monthlyHoursSavedEstimate / totalEmployeeHours);
    const personMonthsSaved = monthlyHoursSavedEstimate / (40 * 4);
    const monthlyLaborCostAvoidance = averageMonthlyCostPerEmployee * personMonthsSaved;
    const monthlyFinCosts = resolvedConversationsMonthly * costPerResolution;
    const conversationsMonthlyPerHuman = conversationVolume / supportTeamSize;

    const anticipatedAdditionalMonthlyCostSavings = monthlyLaborCostAvoidance * (anticipatedYearOverYearGrowthRate/100.0);
    const anticipatedCopilotSavings = ((supportTeamSize * averageMonthlyCostPerEmployee) * (anticipatedCopilotEfficiency / 100.0));
    const anticipatedCopilotCosts = (supportTeamSize * 29);
    const anticipateAnnualNetSavings = 12 * ((monthlyLaborCostAvoidance + anticipatedCopilotSavings) - (monthlyFinCosts + anticipatedCopilotCosts));

    setOutput('.conversationVolumeOutput', `${conversationVolume}`)
    setOutput('.conversationsMonthlyPerHumanOutput', `${conversationsMonthlyPerHuman}`)
    setOutput('.supportTeamSizeOutput', `${supportTeamSize}`)
    setOutput('.resolutionRateOutput', `${resolutionRate}%`)
    setOutput('.resolvedConversationsMonthlyOutput', `${resolvedConversationsMonthly.toFixed(0)}`)
    setOutput('.involvementRateOutput', `${involvementRate}%`)
    setOutput('.averageMonthlyCostPerEmployeeOutput', `$${averageMonthlyCostPerEmployee}`)
    setOutput('.monthlySalariesCostOutput', `$${supportTeamSize * averageMonthlyCostPerEmployee}`)
    setOutput('.conversationsPerEmployeePerMonthOutput', `${(conversationVolume / supportTeamSize).toFixed(0)}`)
    setOutput('.monthlyHoursSavedEstimateOutput', `${monthlyHoursSavedEstimate.toFixed(1)}`)
    setOutput('.monthlyLaborCostAvoidanceOutput', `$${monthlyLaborCostAvoidance.toFixed(0)}`)
    setOutput('.monthlyFinCostsOutput', `$${monthlyFinCosts.toFixed(2)}`)
    setOutput('.handlingTimeMultipleForHumanHandledOutput', `${(1.0 / ratioOfFinConversationTimeVsHuman).toFixed(0)}`)
    setOutput('.percentageSavingsOutput', `${percentageTeamSavings.toFixed(1)}`)
    setOutput('.anticipatedYearOverYearGrowthRateOutput', `${anticipatedYearOverYearGrowthRate}%`)
    setOutput('.anticipatedAdditionalStaffingCostAvoidanceFromGrowthOutput', `$${anticipatedAdditionalMonthlyCostSavings.toFixed(0)}`)
    setOutput('.anticipatedCopilotEfficiency', `${anticipatedCopilotEfficiency}`)
    setOutput('.anticipatedCopilotLaborCostAvoidanceOutput', `$${anticipatedCopilotSavings.toFixed(0)}`)
    setOutput('.anticipateAnnualNetSavingsOutput', `$${anticipateAnnualNetSavings.toFixed(0)}`)
}

function setOutput(selector, text) {
    for (const outputElement of document.querySelectorAll(selector)) {
        outputElement.textContent = text;
    }
}

function setSliderValue(target, value) {
    var compositeSlider = target.closest('.compositeSlider');
    var rangeSlider = compositeSlider.getElementsByClassName('slider')[0];
    var sliderValue = compositeSlider.getElementsByClassName('compositeSliderValue')[0];
    rangeSlider.value = value;
    sliderValue.innerText = value;
    calculate();
}

document.querySelectorAll('input.slider').forEach(input => {
    input.addEventListener('input', function() {
        var compositeSlider = this.closest('.compositeSlider');
        var sliderValue = compositeSlider.getElementsByClassName('compositeSliderValue')[0];
        sliderValue.innerText = this.value;
        calculate();
    });
});
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', calculate);
});

function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(param);
    // Check if the parameter is a positive integer
    return (value !== null && /^\d+$/.test(value)) ? parseInt(value, 10) : null;
}

function setInputValueFromQueryParam(param) {
    const value = getQueryParam(param);
    if (value == null) return;
    let input = document.getElementById(param + 'Input');
    input.value = value;
    const event = new Event('input', {bubbles: true, cancelable: true});
    input.dispatchEvent(event);
}

function readQueryParams () {
    setInputValueFromQueryParam('resolutionRate');
    setInputValueFromQueryParam('conversationVolume');
    setInputValueFromQueryParam('supportTeamSize');
    setInputValueFromQueryParam('involvementRate');
    setInputValueFromQueryParam('averageMonthlyCostPerEmployee');
    setInputValueFromQueryParam('anticipatedYearOverYearGrowthRate');
    setInputValueFromQueryParam('anticipatedCopilotEfficiency');
}

readQueryParams();
calculate();