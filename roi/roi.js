function calculate() {
    const conversations = parseInt(document.getElementById('conversationVolumeInput').value, 10);
    
    const teamSize = parseInt(document.getElementById('supportTeamSizeInput').value, 10);
    const resolutionRate = parseFloat(document.getElementById('resolutionRateInput').value);
    const involvementRate = parseFloat(document.getElementById('involvementRateInput').value);
    const costPerEmployeeMonth = parseFloat(document.getElementById('averageMonthlyCostPerEmployeeInput').value);
    const ratioOfFinConversationTimeVsHuman = 0.33; //todo - derive that from team size vs volume...
    const costPerResolution = 0.99;

    const resolvedConversations = conversations * (resolutionRate/100.0) * (involvementRate/100.0);
    const monthlyPerAgent = conversations / teamSize
    const hoursPerConversation = (40 * 4) / monthlyPerAgent ;
    const timeSavings = resolvedConversations * (hoursPerConversation * ratioOfFinConversationTimeVsHuman); // assuming 0.5 hours saved per resolution
    const personMonthsSaved = timeSavings / (40 * 4);
    const costSavings = costPerEmployeeMonth * personMonthsSaved;
    const finCosts = resolvedConversations * costPerResolution;
    const roiDollars = costSavings - finCosts;

    setOutput('.teamSizeOutput', `${teamSize}`)
    setOutput('.resolutionRateOutput', `${resolutionRate}%`)
    setOutput('.resolvedConversationsMonthlyOutput', `${resolvedConversations.toFixed(0)}`)
    setOutput('.involvementRateOutput', `${involvementRate}%`)
    setOutput('.monthlySalariesCostOutput', `$${teamSize * costPerEmployeeMonth}`)
    setOutput('.conversationsPerEmployeePerMonthOutput', `${(conversations / teamSize).toFixed(0)}`)
    setOutput('.monthlyHoursSavedEstimateOutput', `${timeSavings.toFixed(1)}`)
    setOutput('.monthlyLaborCostAvoidanceOutput', `$${costSavings.toFixed(2)}`)
    setOutput('.monthlyFinCostsOutput', `$${finCosts.toFixed(2)}`)
    setOutput('.handlingTimeMultipleForHumanHandledOutput', `${(1.0 / ratioOfFinConversationTimeVsHuman).toFixed(0)}`)
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

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', calculate);
});

document.querySelectorAll('input.slider').forEach(input => {
    input.addEventListener('input', function() {
        var compositeSlider = this.closest('.compositeSlider');
        var sliderValue = compositeSlider.getElementsByClassName('compositeSliderValue')[0];
        sliderValue.innerText = this.value;
        calculate();
    });
});

calculate();