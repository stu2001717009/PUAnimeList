const sortArr = ['ascending', 'descending'];
const orderArr = ['title', 'score', 'air_start', 'air_end'];
const tableHeaders = ['', 'Title', 'Score', 'Number of episodes', 'Start date', 'End date'];

let sort = sortArr[0];
let order = orderArr[0];
let isCardsView = true;

$(document).ready(function () {
    getAnimes();
});

function getAnimes() {
    fetch(`https://api.jikan.moe/v3/user/vas4oo/animelist?order_by=${order}&sort=${sort}`)
        .then(response => response.json())
        .then(data => {
            createList(data.anime);
        });
}

$('#sort-select').change(function () {
    sort = sortArr[$(this).val() - 1];
    getAnimes();
});

$('#order-select').change(function () {
    order = orderArr[$(this).val() - 1];
    getAnimes();
});

$('#state-of-view').click(function () {
    isCardsView = !isCardsView;
    $(this).attr('class', isCardsView ? 'fa fa-bars fa-2x' : 'fa fa-th fa-2x');
    $("#animes").attr('class', isCardsView ? 'anime-container-card' : 'anime-container-list');
    getAnimes();
});


function createList(animes) {
    let container = $("#animes");
    container.html('');

    if (isCardsView) {
        animes.forEach(anime => {
            let wrapper = document.createElement('div');
            wrapper.className = "anime-card";

            let content = document.createElement('div');
            content.className = 'anime-item-content';

            let image = document.createElement('img');
            image.src = anime.image_url;
            image.alt = anime.title;
            image.width = 220;
            image.height = 300;
            wrapper.append(image);

            let title = document.createElement('h5');
            title.innerHTML = anime.title;
            content.append(title);

            let score = document.createElement('div');
            if (anime.score) {
                for (let i = 1; i < 10; i++) {
                    let star = document.createElement('span');
                    star.className = "fa fa-star fa-lg" + (i < anime.score ? ' checked' : '');
                    score.append(star);
                }
            }
            else {
                score.className = 'score';
                score.innerHTML = 'Not Rated';
            }
            content.append(score);

            let numberOfEpisodes = document.createElement('div');
            numberOfEpisodes.innerHTML = 'Number of episodes: ' + (anime.total_episodes > 0 ? anime.total_episodes : 'Still going');
            content.append(numberOfEpisodes);

            let startDate = document.createElement('div');
            startDate.innerHTML = 'Start date: ' + anime.start_date.substr(0, 10);
            content.append(startDate);

            let endDate = document.createElement('div');
            endDate.innerHTML = 'End date: ' + (anime.end_date ? anime.end_date.substr(0, 10) : 'Not finished');
            content.append(endDate);

            let linkToMal = document.createElement('a');
            linkToMal.innerHTML = 'Link to the anime';
            linkToMal.href = anime.url;
            linkToMal.target = "_blank";
            content.append(linkToMal);

            wrapper.append(content);
            container.append(wrapper);
        });
    }
    else {
        let wrapper = document.createElement('div');
        wrapper.className = "table-wrapper";
        let table = document.createElement('table');
        let tHead = document.createElement('thead');
        let trHead = document.createElement('tr');
        let tBody = document.createElement('tbody');

        for (let el of tableHeaders) {
            let th = document.createElement('th');
            th.innerHTML = el;
            trHead.append(th);
        }

        tHead.append(trHead);
        table.append(tHead);

        animes.forEach(anime => {
            let tr = document.createElement('tr');

            let imageTd = document.createElement('td');
            let image = document.createElement('img');
            image.src = anime.image_url;
            image.alt = anime.title;
            image.width = 50;
            image.height = 70;
            imageTd.append(image);
            tr.append(imageTd);

            let title = document.createElement('td');
            let titleLink = document.createElement('a');
            titleLink.innerHTML = anime.title;
            titleLink.href = anime.url;
            titleLink.target = '_blank';
            title.append(titleLink);
            tr.append(title);

            let score = document.createElement('td');
            score.innerHTML = anime.score ? anime.score + '/10' : 'Not Rated';
            tr.append(score);

            let numberOfEpisodes = document.createElement('td');
            numberOfEpisodes.innerHTML = anime.total_episodes > 0 ? anime.total_episodes : 'Still going';
            tr.append(numberOfEpisodes);

            let startDate = document.createElement('td');
            startDate.innerHTML = anime.start_date.substr(0, 10);
            tr.append(startDate);

            let endDate = document.createElement('td');
            endDate.innerHTML = anime.end_date ? anime.end_date.substr(0, 10) : 'Not finished';
            tr.append(endDate);

            tBody.append(tr);
        });

        table.append(tBody);
        wrapper.append(table);
        container.append(wrapper);
    }
}