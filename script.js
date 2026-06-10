function sanitize(value) {
    return Math.max(0, Number(value) || 0);
}

function calculateCarbonFootprint(
    transport,
    electricity,
    food,
    waste
){
    return (
        transport * 0.21 +
        electricity * 0.5 +
        food * 2 +
        waste * 1.5
    );
}

function calculateEcoScore(totalCO2){
    let score = 100 - totalCO2 / 5;

    if(score < 0) score = 0;
    if(score > 100) score = 100;

    return Math.round(score);
}

function getBadge(score){

    if(score >= 80)
        return "🏆 Sustainability Champion";

    if(score >= 60)
        return "🌿 Carbon Saver";

    if(score >= 40)
        return "🌱 Green Beginner";

    return "⚠ High Carbon Impact";
}

function generateTips(
    transport,
    electricity,
    food,
    waste
){
    const tips = [];

    if(transport > 100)
        tips.push(
            "Use public transport."
        );

    if(electricity > 300)
        tips.push(
            "Switch to LED bulbs."
        );

    if(food > 10)
        tips.push(
            "Reduce meat consumption."
        );

    if(waste > 10)
        tips.push(
            "Recycle more."
        );

    if(tips.length === 0){
        tips.push(
            "Excellent work!"
        );
    }

    return tips;
}

function loadHistory(){

    const history =
        JSON.parse(
            localStorage.getItem("history")
        ) || [];

    const historyList =
        document.getElementById(
            "historyList"
        );

    historyList.innerHTML = "";

    history.forEach(value => {

        const li =
            document.createElement("li");

        li.textContent =
            value.toFixed(2) +
            " kg CO₂";

        historyList.appendChild(li);
    });

    renderChart(history);
}

function renderChart(history){

    const canvas =
        document.getElementById(
            "carbonChart"
        );

    if(!canvas) return;

    const ctx =
        canvas.getContext("2d");

    new Chart(ctx,{
        type:"line",
        data:{
            labels:
                history.map(
                    (_,i)=>`Entry ${i+1}`
                ),
            datasets:[{
                label:
                    "Carbon Footprint",
                data:history
            }]
        }
    });
}

document
.getElementById("saveGoalBtn")
.addEventListener(
"click",
()=>{

    const goal =
        sanitize(
            document.getElementById(
                "goal"
            ).value
        );

    localStorage.setItem(
        "carbonGoal",
        goal
    );

    document.getElementById(
        "goalStatus"
    ).textContent =
        `Goal Saved: ${goal} kg CO₂`;
});

document
.getElementById("calculateBtn")
.addEventListener(
"click",
()=>{

    const transport =
        sanitize(
            document.getElementById(
                "transport"
            ).value
        );

    const electricity =
        sanitize(
            document.getElementById(
                "electricity"
            ).value
        );

    const food =
        sanitize(
            document.getElementById(
                "food"
            ).value
        );

    const waste =
        sanitize(
            document.getElementById(
                "waste"
            ).value
        );

    const total =
        calculateCarbonFootprint(
            transport,
            electricity,
            food,
            waste
        );

    const score =
        calculateEcoScore(
            total
        );

    document.getElementById(
        "result"
    ).textContent =
        total.toFixed(2) +
        " kg CO₂";

    document.getElementById(
        "ecoScore"
    ).textContent =
        score + "/100";

    document.getElementById(
        "badge"
    ).textContent =
        getBadge(score);

    const tips =
        generateTips(
            transport,
            electricity,
            food,
            waste
        );

    const tipsList =
        document.getElementById(
            "tips"
        );

    tipsList.innerHTML = "";

    tips.forEach(tip=>{

        const li =
            document.createElement("li");

        li.textContent = tip;

        tipsList.appendChild(li);
    });

    const history =
        JSON.parse(
            localStorage.getItem(
                "history"
            )
        ) || [];

    history.push(total);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    loadHistory();
});

loadHistory();