
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', calculate);
});

function calculate() {
    const conversations = parseInt(document.getElementById('conversationVolumeSlider').value, 10);
    const teamSize = parseInt(document.getElementById('supportTeamSizeSlider').value, 10);
    const resolutionRate = parseFloat(document.getElementById('resolutionRateSlider').value);
    // const involvementRate = parseFloat(document.getElementById('involvementSlider').value);
    const involvementRate = 100;
    const costPerEmployeeMonth = parseFloat(document.getElementById('averageMonthlyCostPerEmployeeSlider').value);
    const ratioOfFinConversationTimeVsHuman = 0.25; //todo - derive that from team size vs volume...
    const costPerResolution = 0.99;

    const resolvedConversations = conversations * (resolutionRate/100.0) * (involvementRate/100.0);
    let monthlyPerAgent = conversations / teamSize
    let hoursPerConversation = (40 * 4) / monthlyPerAgent ;
    const timeSavings = resolvedConversations * (hoursPerConversation * ratioOfFinConversationTimeVsHuman); // assuming 0.5 hours saved per resolution
    let personMonthsSaved = timeSavings / (40 * 4);
    const costSavings = costPerEmployeeMonth * personMonthsSaved;
    let finCosts = resolvedConversations * costPerResolution;
    // let roiDollars = costSavings-finCosts;

    // document.getElementById('impactMessage').textContent = `
    // You currently spend approximately $${teamSize * costPerEmployeeMonth} on support salaries.
    // Each team member handles approximately ${(conversations / teamSize).toFixed(0)} conversations per month.
    //
    // Fin will resolve approximately ${resolvedConversations.toFixed(0)} conversations per month.
    //
    // We estimate that will save you ${timeSavings.toFixed(1)} hours
    // which avoids spending $${costSavings.toFixed(2)} on staffing costs,
    // assuming it takes on average ${ratioOfFinConversationTimeVsHuman.toFixed(2)} hours to handle each.
    //
    // TOTAL ROI $${roiDollars.toFixed(0)}
    // `;
    document.getElementById('roi-output').textContent = `
    You could save $${costSavings.toFixed(2)} on staffing costs per month, by spending $${finCosts.toFixed(2)}.
    `;
    document.getElementById('roi-explanation').textContent = `
     We see in practice that the conversations humans handle that Fin cannot typically take ${1.0 / ratioOfFinConversationTimeVsHuman} times longer than those it can resolve. 
     Savings are based on human labor avoided on the conversations Fin takes care of.
     Based on the values above, Fin will resolve ${resolvedConversations} conversations, 
     saving you ${timeSavings} hours of human labor per month. At your average salary of $${costPerEmployeeMonth} and subtracting the cost 
     for Fin ($${finCosts}) this works out at $${costSavings.toFixed(2)} savings. 
    `;
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
        console.log("calculate range change")
        calculate();
    });
});

calculate();