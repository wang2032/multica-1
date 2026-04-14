const attractions = [
    {
        name: "故宫博物院",
        description: "中国明清两代的皇家宫殿，世界上规模最大、保存最完整的木质结构古建筑群之一。",
        stayTime: "3小时"
    },
    {
        name: "天坛公园",
        description: "古代皇帝祭天、祈谷的场所，建筑群庄严宏伟，展现了中华民族的天人合一思想。",
        stayTime: "2小时"
    },
    {
        name: "八达岭长城",
        description: "万里长城的精华段落，地势险要，风景壮丽，是北京必去的标志性景点。",
        stayTime: "4小时"
    },
    {
        name: "颐和园",
        description: "中国现存最大的皇家园林，以昆明湖和万寿山为主体，集江南园林艺术精华于一身。",
        stayTime: "3小时"
    },
    {
        name: "天安门广场",
        description: "世界上最大的城市广场，位于北京正中心，是中华人民共和国的象征性地标。",
        stayTime: "1小时"
    },
    {
        name: "圆明园遗址公园",
        description: "清代皇家园林，如今残存的遗址见证了历史，是进行爱国主义教育的重要基地。",
        stayTime: "2小时"
    }
];

function renderAttractions() {
    const container = document.getElementById('attractionList');
    if (!container) return;

    attractions.forEach(attraction => {
        const card = document.createElement('div');
        card.className = 'attraction-card';

        const nameEl = document.createElement('div');
        nameEl.className = 'attraction-name';
        nameEl.textContent = attraction.name;

        const descEl = document.createElement('div');
        descEl.className = 'attraction-description';
        descEl.textContent = attraction.description;

        const stayEl = document.createElement('span');
        stayEl.className = 'attraction-stay-time';
        stayEl.textContent = `预计停留: ${attraction.stayTime}`;

        card.appendChild(nameEl);
        card.appendChild(descEl);
        card.appendChild(stayEl);
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', renderAttractions);