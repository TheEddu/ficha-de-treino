
const translationUrl = 'https://raw.githubusercontent.com/joao-gugel/exercicios-bd-ptbr/main/exercises/exercises-ptbr-full-translation.json';

const imagesBaseUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const ficha = {
    segunda: [
        'Close-Grip_Front_Lat_Pulldown',
        'Machine_Preacher_Curls',
        'Seated_Dumbbell_Palms-Up_Wrist_Curl',
        'Reverse_Barbell_Curl',
        'Leg_Press',
        'Machine_Bench_Press',
        'Triceps_Pushdown'
    ],
    terca: [
        'Walking_Treadmill',
        'Leg_Extensions',
        'Seated_Leg_Curl',
        'Decline_Crunch',
        'Incline_Dumbbell_Flyes',
        'Side_Lateral_Raise',
    ],
    quarta: [
        'Seated_Cable_Rows',
        'Machine_Bench_Press',
        'Machine_Preacher_Curls',
        'Seated_Dumbbell_Palms-Up_Wrist_Curl',
        'Reverse_Barbell_Curl',
        'Hack_Squat',
        'Machine_Shoulder_Military_Press'
    ],
    quinta: [
        'Walking_Treadmill',
        'Close-Grip_Front_Lat_Pulldown',
        'Leg_Extensions',
        'Seated_Leg_Curl',
        'Side_Lateral_Raise',
    ],
    sexta: [
        'Incline_Dumbbell_Flyes',
        'Machine_Bench_Press',
        'Triceps_Pushdown_-_Rope_Attachment',
        'Decline_Crunch',
        'Machine_Preacher_Curls',
        'Seated_Dumbbell_Palms-Up_Wrist_Curl',
        'Reverse_Barbell_Curl',
    ]
};

const container = document.getElementById('treino-container');
const template = document.getElementById('exercise-card-template');

async function loadExercises() {
    try {
        const response = await fetch(translationUrl);
        if (!response.ok) throw new Error('Falha ao carregar dados');
        const allExercises = await response.json();

        const exerciseMap = {};
        allExercises.forEach(ex => exerciseMap[ex.id] = ex);

        const diasOrdenados = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

        diasOrdenados.forEach(dia => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');

            const title = document.createElement('h2');
            title.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
            dayDiv.appendChild(title);

            ficha[dia].forEach(id => {
                const exercise = exerciseMap[id];
                if (!exercise) {
                    dayDiv.innerHTML += `<div class="exercise-card"><div class="card-header"><h3>Erro: ${id}</h3></div></div>`;
                    return;
                }

                const cardNode = template.content.cloneNode(true);
                const card = cardNode.firstElementChild;

                // Nome
                card.querySelector('.exercise-name').textContent = exercise.name;

                // Carrossel
                const carousel = card.querySelector('.carousel');
                const dotsContainer = card.querySelector('.carousel-dots');
                let currentSlide = 0;

                [0, 1].forEach((num, index) => {
                    const img = document.createElement('img');
                    img.src = `${imagesBaseUrl}${exercise.id}/${num}.jpg`;
                    img.alt = `${exercise.name} - ${index + 1}`;
                    img.loading = 'lazy';
                    carousel.appendChild(img);

                    const dot = document.createElement('span');
                    dot.dataset.index = index;
                    if (index === 0) dot.classList.add('active');
                    dotsContainer.appendChild(dot);
                });

                const slides = carousel.querySelectorAll('img');
                const dots = dotsContainer.querySelectorAll('span');

                function showSlide(n) {
                    currentSlide = (n + slides.length) % slides.length;
                    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
                    dots.forEach(d => d.classList.remove('active'));
                    dots[currentSlide].classList.add('active');
                }

                card.querySelector('.carousel-next').addEventListener('click', () => showSlide(currentSlide + 1));
                card.querySelector('.carousel-prev').addEventListener('click', () => showSlide(currentSlide - 1));
                dots.forEach(dot => dot.addEventListener('click', () => showSlide(parseInt(dot.dataset.index))));

                // Dados técnicos
                card.querySelector('.force').textContent = exercise.force || 'N/A';
                card.querySelector('.level').textContent = exercise.level || 'N/A';
                card.querySelector('.mechanic').textContent = exercise.mechanic || 'N/A';
                card.querySelector('.equipment').textContent = exercise.equipment || 'N/A';
                card.querySelector('.primary-muscles').textContent = exercise.primaryMuscles?.join(', ') || 'N/A';
                card.querySelector('.secondary-muscles').textContent = exercise.secondaryMuscles?.join(', ') || 'N/A';

                // Instruções
                const list = card.querySelector('.instructions-list');
                if (exercise.instructions?.length > 0) {
                    exercise.instructions.forEach(step => {
                        const li = document.createElement('li');
                        li.textContent = step;
                        list.appendChild(li);
                    });
                } else {
                    card.querySelector('.instructions').style.display = 'none';
                }

                // Toggle
                const expandableSection = card.querySelector('.expandable-section');
                const header = card.querySelector('.expandable-header');
                header.addEventListener('click', () => {
                    expandableSection.classList.toggle('collapsed');
                });

                dayDiv.appendChild(card);
            });

            container.appendChild(dayDiv);
        });

    } catch (err) {
        container.innerHTML = `<p style="color:red;text-align:center;">Erro: ${err.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadExercises);