function sanitize(value) {
    return Math.max(0, Number(value) || 0);
}

function calculateCarbonFootprint(
    transport,
    electricity,
    food,
    waste
){
    const transportCO2 = transport * 0.21;
    const electricityCO2 = electricity * 0.5;
    const foodCO2 = food * 2;
    const wasteCO2 = waste * 1.5;

    return (
        transportCO2 +
        electricityCO2 +
        foodCO2 +
        wasteCO2
    );
}

function calculateEcoScore(totalCO2){

    let score = 100 - totalCO2 / 5;

    if(score < 0) score = 0;
    if(score > 100) score = 100;

    return Math.round(score);
}

function getBadge(score){

    if(score >= 80){
        return "🏆 Sustainability Champion";
    }

    if(score >= 60){
        return "🌿 Carbon Saver";
    }

    if(score >= 40){
        return "🌱 Green Beginner";
    }

    return "⚠ High Carbon Impact";
}

function generateTips(
    transport,
    electricity,
    food,
    waste
){
    const tips = [];

    if(transport > 100){
        tips.push(
            "Use public transport, cycling, or carpooling."
        );
    }

    if(electricity > 300){
        tips.push(
            "Switch to LED bulbs and energy-efficient appliances."
        );
    }

    if(food > 10){
        tips.push(
            "Reduce meat consumption and try plant-based meals."
        );
    }

    if(waste > 10){
        tips.push(
            "Recycle more and reduce single-use plastics."
        );
    }

    if(tips.length === 0){
        tips.push(
            "Excellent work! Keep maintaining sustainable habits."
        );
    }

    return tips;
}

document
.getElementById("calculateBtn")
.addEventListener("click", () => {

    const transport = sanitize(
        document.getElementById("transport").value
    );

    const electricity = sanitize(
        document.getElementById("electricity").value
    );

    const food = sanitize(
        document.getElementById("food").value
    );

    const waste = sanitize(
        document.getElementById("waste").value
    );

    const total = calculateCarbonFootprint(
        transport,
        electricity,
        food,
        waste
    );

    const score = calculateEcoScore(total);

    document.getElementById("result").textContent =
        total.toFixed(2) + " kg CO₂";

    document.getElementById("ecoScore").textContent =
        score + "/100";

    document.getElementById("badge").textContent =
        getBadge(score);

    const tips = generateTips(
        transport,
        electricity,
        food,
        waste
    );

    const tipsList =
        document.getElementById("tips");

    tipsList.innerHTML = "";

    tips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        tipsList.appendChild(li);
    });
});