function calculate() {
    const conversationVolume = parseInt(document.getElementById('conversationVolumeInput').value, 10);
    
    const teamSize = parseInt(document.getElementById('supportTeamSizeInput').value, 10);
    const resolutionRate = parseFloat(document.getElementById('resolutionRateInput').value);
    const involvementRate = parseFloat(document.getElementById('involvementRateInput').value);
    const costPerEmployeeMonth = parseFloat(document.getElementById('averageMonthlyCostPerEmployeeInput').value);
    const anticipatedYearOverYearGrowthRate = parseFloat(document.getElementById('anticipatedYearOverYearGrowthRateInput').value);
    const anticipatedCopilotEfficiency = parseFloat(document.getElementById('anticipatedCopilotEfficiencyInput').value);
    const ratioOfFinConversationTimeVsHuman = 0.33;
    const costPerResolution = 0.99;

    const resolvedConversations = conversationVolume * (resolutionRate/100.0) * (involvementRate/100.0);

    const totalEmployeeHours = teamSize * (40 * 4);
    const humanWeightedResolutions = (conversationVolume - resolvedConversations) / ratioOfFinConversationTimeVsHuman;
    const timeSavings = totalEmployeeHours * (resolvedConversations/(resolvedConversations+humanWeightedResolutions));
    // rough modelling - https://docs.google.com/spreadsheets/d/1QprxDyqQCCnXLw3kqP-3HiRnj9SFaXUtuvyzpHbnc8E/edit#gid=0
    // really dumb model - just assumes fin handled would take a human ratioOfFinConversationTimeVsHuman amount of time vs the ones find doesn't handle

    const percentageTeamSavings = 100 * (timeSavings / totalEmployeeHours);

    const personMonthsSaved = timeSavings / (40 * 4);
    const costSavings = costPerEmployeeMonth * personMonthsSaved;
    const finCosts = resolvedConversations * costPerResolution;
    const conversationsMonthlyPerHuman = conversationVolume / teamSize;

    const anticipatedAdditonalMonthlyCostSavings = costSavings * (anticipatedYearOverYearGrowthRate/100.0);
    const anticipatedCopilotSavings = ((teamSize * costPerEmployeeMonth) * (anticipatedCopilotEfficiency / 100.0));
    const anticipatedCopilotCosts = (teamSize * 29);
    const anticipateAnnualNetSavings = 12 * ((costSavings + anticipatedCopilotSavings) - (finCosts + anticipatedCopilotCosts));

    setOutput('.conversationVolumeOutput', `${conversationVolume}`)
    setOutput('.conversationsMonthlyPerHumanOutput', `${conversationsMonthlyPerHuman}`)
    setOutput('.teamSizeOutput', `${teamSize}`)
    setOutput('.resolutionRateOutput', `${resolutionRate}%`)
    setOutput('.resolvedConversationsMonthlyOutput', `${resolvedConversations.toFixed(0)}`)
    setOutput('.involvementRateOutput', `${involvementRate}%`)
    setOutput('.costPerEmployeeMonthOutput', `$${costPerEmployeeMonth}`)
    setOutput('.monthlySalariesCostOutput', `$${teamSize * costPerEmployeeMonth}`)
    setOutput('.conversationsPerEmployeePerMonthOutput', `${(conversationVolume / teamSize).toFixed(0)}`)
    setOutput('.monthlyHoursSavedEstimateOutput', `${timeSavings.toFixed(1)}`)
    setOutput('.monthlyLaborCostAvoidanceOutput', `$${costSavings.toFixed(0)}`)
    setOutput('.monthlyFinCostsOutput', `$${finCosts.toFixed(2)}`)
    setOutput('.handlingTimeMultipleForHumanHandledOutput', `${(1.0 / ratioOfFinConversationTimeVsHuman).toFixed(0)}`)
    setOutput('.percentageSavingsOutput', `${percentageTeamSavings.toFixed(1)}`)
    setOutput('.anticipatedYearOverYearGrowthRateOutput', `${anticipatedYearOverYearGrowthRate}%`)
    setOutput('.anticipatedAdditionalStaffingCostAvoidanceFromGrowthOutput', `$${anticipatedAdditonalMonthlyCostSavings.toFixed(0)}`)
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

function readQueryParam(param) {
    const value = getQueryParam(param);
    if (value == null) return;
    let input = document.getElementById(param + 'Input');
    input.value = value;
    const event = new Event('input', {bubbles: true, cancelable: true});
    input.dispatchEvent(event);
}

function readQueryParams () {
    readQueryParam('resolutionRate');
    readQueryParam('conversationVolume');
    readQueryParam('supportTeamSize');
    readQueryParam('involvementRate');
    readQueryParam('averageMonthlyCostPerEmployee');
    readQueryParam('anticipatedYearOverYearGrowthRate');
    readQueryParam('anticipatedCopilotEfficiency');
}

readQueryParams();
calculate();