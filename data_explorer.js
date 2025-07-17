document.addEventListener('DOMContentLoaded', () => {
    const menuItems = [
        "ABOUT", "PILOTS", "EVANGELION", "ANGELS", "NERV", "SEELE",
        "2nd IMPACT", "LCL", "S² ENGINE", "CREDITS", "GUESTBOOK"
    ];
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const virtualKeyboard = document.getElementById('virtual-keyboard');
    const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');
    const contentArea = document.getElementById('content-area');
    const currentMenuTitle = document.getElementById('current-menu-title');
    const menuListElement = document.getElementById('menu-list');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // --- [추가됨] 로딩 관련 DOM 요소 ---
    const loadingContainer = document.getElementById('loading-container');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');


    // Function to update current time
    function updateTime() {
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        document.getElementById('current-time').textContent = now.toLocaleString('ko-KR', options).replace(/\./g, '/').replace(/ /g, ' ');
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Initialize virtual keyboard
    function initializeKeyboard() {
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE', 'ENTER'], // ENTER 키 추가
            ['SPACE']
        ];

        keyboardLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('keyboard-row');
            row.forEach(key => {
                const button = document.createElement('button');
                button.classList.add('key-button');
                button.textContent = key;
                button.addEventListener('click', () => {
                    if (key === 'BACKSPACE') {
                        searchBar.value = searchBar.value.slice(0, -1);
                    } else if (key === 'SPACE') {
                        searchBar.value += ' ';
                    } else if (key === 'ENTER') { // ENTER 키 기능 구현
                        performSearch();
                    } else {
                        searchBar.value += key;
                    }
                    updateAutocomplete();
                });
                rowDiv.appendChild(button);
            });
            virtualKeyboard.appendChild(rowDiv);
        });
    }

    // Autocomplete functionality
    function updateAutocomplete() {
        const query = searchBar.value.toUpperCase();
        autocompleteSuggestions.innerHTML = '';
        if (query.length === 0) {
            return;
        }

        const filteredItems = menuItems.filter(item => item.toUpperCase().startsWith(query));

        filteredItems.forEach(item => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.classList.add('autocomplete-suggestion');
            suggestionDiv.textContent = item;
            suggestionDiv.addEventListener('click', () => {
                searchBar.value = item;
                autocompleteSuggestions.innerHTML = '';
                performSearch();
            });
            autocompleteSuggestions.appendChild(suggestionDiv);
        });
    }
    
    const pageImages = {
        "ABOUT": "img/about.gif",
        "PILOTS": "img/pilots.gif",
        "EVANGELION": "img/eva.gif",
        "ANGELS": "img/angels.gif",
        "NERV": "img/nerv.gif",
        "SEELE": "img/seele.gif",
        "2ND IMPACT": "img/second_impact.gif",
        "LCL": "img/lcl.gif",
        "S² ENGINE": "img/s2_engine.gif",
        "CREDITS": "img/credits.gif",
        "GUESTBOOK": "img/guestbook.gif"
    };

    // --- [수정됨] 로딩 인터렉션이 추가된 검색 기능 ---
    function performSearch() {
        const searchTerm = searchBar.value.toUpperCase().trim();
        autocompleteSuggestions.innerHTML = ''; // 검색 후 자동완성 목록 숨기기

        if (searchTerm === "GO INSIDE") {
            window.location.href = "https://evafan.vercel.app/";
            return;
        }
        
        const matchedMenuItem = menuItems.find(item => item.toUpperCase() === searchTerm);

        if (matchedMenuItem) {
            currentMenuTitle.textContent = matchedMenuItem;
            contentArea.style.display = 'none'; // 기존 콘텐츠 숨기기
            loadingContainer.style.display = 'flex'; // 로딩 UI 표시

            const imagePath = pageImages[matchedMenuItem.toUpperCase()];
            const contentHtml = pageContent[matchedMenuItem.toUpperCase()] || `<p class="log-entry text-red">ERROR: Content for <strong>${matchedMenuItem}</strong> not found.</p>`;

            if (imagePath) {
                // 이미지가 있는 경우, 로딩 인터렉션 실행
                loadingBar.style.width = '0%';
                loadingText.textContent = 'LOADING... 0%';

                const img = new Image();
                img.src = imagePath;

                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.floor(Math.random() * 5) + 1; // 로딩 속도 시뮬레이션
                    if (progress >= 99) {
                        progress = 99;
                        clearInterval(interval); // 99%에서 잠시 멈춤
                    }
                    loadingBar.style.width = progress + '%';
                    loadingText.textContent = `LOADING... ${progress}%`;
                }, 80);

                // 이미지 로딩이 완료되면
                img.onload = () => {
                    clearInterval(interval);
                    loadingBar.style.width = '100%';
                    loadingText.textContent = 'LOADING... 100%';

                    // 100%를 보여주고 콘텐츠를 표시
                    setTimeout(() => {
                        const imageHtml = `
                            <div class="content-image-container">
                                <img src="${img.src}" alt="${matchedMenuItem}" class="content-image">
                            </div>
                        `;
                        contentArea.innerHTML = imageHtml + contentHtml;
                        loadingContainer.style.display = 'none'; // 로딩 UI 숨기기
                        contentArea.style.display = 'block'; // 콘텐츠 표시
                        contentArea.scrollTop = 0; // 콘텐츠 상단으로 스크롤
                    }, 400); 
                };

                // 이미지 로딩 실패 시
                img.onerror = () => {
                    clearInterval(interval);
                    contentArea.innerHTML = contentHtml; // 텍스트 콘텐츠만 표시
                    loadingContainer.style.display = 'none';
                    contentArea.style.display = 'block';
                    contentArea.scrollTop = 0;
                };

            } else {
                // 이미지가 없는 메뉴 항목의 경우 즉시 콘텐츠 표시
                contentArea.innerHTML = contentHtml;
                loadingContainer.style.display = 'none';
                contentArea.style.display = 'block';
                contentArea.scrollTop = 0;
            }

        } else {
            // 일치하는 메뉴가 없는 경우 에러 메시지 표시
            contentArea.innerHTML = '<p class="log-entry text-red">ERROR: Category not found. Please try again.</p>';
            loadingContainer.style.display = 'none';
            contentArea.style.display = 'block';
        }
        searchBar.value = ''; // 검색창 비우기
    }

    const pageContent = {
        "ABOUT": `
            <h3 class="log-entry">ABOUT THIS PROJECT</h3>
            <p class="log-entry">This is a fan-made project dedicated to the world of Neon Genesis Evangelion. It aims to provide an interactive data explorer experience, allowing users to delve into various aspects of the series, including its characters, mechs, organizations, and lore.</p>
            <p class="log-entry">The project is built using modern web technologies, focusing on a retro-futuristic GUI aesthetic inspired by the series itself. All content is for informational and fan purposes only.</p>
            <p class="log-entry">For more details, please refer to the CREDITS section.</p>
        `,
        "PILOTS": `
            <h3 class="log-entry">PILOTS: THE CHOSEN CHILDREN</h3>
            <div class="content-section">
                <h4>SHINJI IKARI (Third Child)</h4>
                <p>The Third Child and the designated pilot of Evangelion Unit-01. He is a withdrawn and introspective boy who struggles with the burden of his role and his relationship with his estranged father, Gendo. His initial reluctance gives way to a complex journey of self-discovery and pain.</p>
            </div>
            <div class="content-section">
                <h4>REI AYANAMI (First Child)</h4>
                <p>The First Child and pilot of Evangelion Unit-00. She is enigmatic, quiet, and seemingly emotionless, with a mysterious past connected to the very core of NERV's secrets and the Human Instrumentality Project. Her existence raises fundamental questions about identity and humanity.</p>
            </div>
            <div class="content-section">
                <h4>ASUKA LANGLEY SORYU (Second Child)</h4>
                <p>The Second Child and the proud, fiery pilot of Evangelion Unit-02. Raised to be an Eva pilot from a young age, she is highly skilled but conceals deep-seated insecurities and a desperate need for validation behind a facade of arrogance.</p>
            </div>
        `,
        "EVANGELION": `
            <h3 class="log-entry">EVANGELION: HUMAN-SIZED DECISIVE WEAPONS</h3>
            <div class="content-section">
                <h4>UNIT-01 (Test Type)</h4>
                <p>The first operational EVA unit. Extensive combat record against multiple Angel threats. Known for unpredictable, autonomous actions under extreme duress. Core Unit: Yui Ikari.</p>
                <ul>
                    <li>Model Type: Test Type</li>
                    <li>Pilot: Shinji Ikari</li>
                    <li>Height: 75m</li>
                    <li>Primary Armaments: Progressive Knife, Pallet Rifle</li>
                    <li>Special Abilities: Berserk Mode, A.T. Field Generation, Regeneration</li>
                </ul>
            </div>
            <div class="content-section">
                <h4>UNIT-02 (Production Model)</h4>
                <p>First production-model with stable operational capabilities. Designed for specialized combat roles. Core Unit: Kyoko Zeppelin Soryu.</p>
                <ul>
                    <li>Model Type: Production Model</li>
                    <li>Pilot: Asuka Langley Soryu</li>
                    <li>Height: 75m</li>
                    <li>Primary Armaments: Progressive Knife, Pallet Rifle, Sonic Glaive</li>
                    <li>Special Abilities: First production-model with stable operational capabilities.</li>
                </ul>
            </div>
        `,
        "ANGELS": `
            <h3 class="log-entry">ANGELS: MYSTERIOUS ADVERSARIES</h3>
            <div class="content-section">
                <h4>ADAM (The First Angel)</h4>
                <p>The first of the Angels, the progenitor of the Third through Seventeenth Angels. Discovered in Antarctica, its awakening led to the Second Impact.</p>
            </div>
            <div class="content-section">
                <h4>LILITH (The Second Angel)</h4>
                <p>The second of the Angels, and the progenitor of humanity ('Lilin'). It is crucified in the deepest level of NERV headquarters, Terminal Dogma.</p>
            </div>
            <div class="content-section">
                <h4>SACHIEL (The Third Angel)</h4>
                <p>The first Angel to appear in Tokyo-3. It possesses a lean, humanoid form and a formidable A.T. Field, capable of self-destruction.</p>
            </div>
            <div class="content-section">
                <h4>RAMIEL (The Fifth Angel)</h4>
                <p>A floating, crystalline octahedron. It possesses a powerful particle beam and one of the strongest A.T. Fields.</p>
            </div>
            <p class="log-entry">And many more... Each Angel possesses unique abilities and a powerful A.T. Field, making them formidable adversaries. Their true purpose remains shrouded in mystery.</p>
        `,
        "NERV": `
            <h3 class="log-entry">NERV: SPECIAL PARAMILITARY AGENCY</h3>
            <p class="log-entry">NERV is a special paramilitary agency under the command of the United Nations, led by Gendo Ikari. Its official purpose is to lead the defense of mankind against the Angels. However, its secret, true objective is to complete the Human Instrumentality Project in accordance with the scenarios outlined by Seele.</p>
            <p class="log-entry">Headquartered in the GeoFront beneath Tokyo-3, NERV possesses the Evangelion units, the only weapons capable of defeating the Angels. The organization holds immense power and operates with a high degree of autonomy, often clashing with the governments that fund it.</p>
            <div class="content-section">
                <h4>Key Personnel:</h4>
                <ul>
                    <li>Gendo Ikari: Commander</li>
                    <li>Kozo Fuyutsuki: Sub-Commander</li>
                    <li>Misato Katsuragi: Operations Director</li>
                    <li>Dr. Ritsuko Akagi: Chief Scientist</li>
                </ul>
            </div>
        `,
        "SEELE": `
            <h3 class="log-entry">SEELE: THE SECRET COUNCIL</h3>
            <p class="log-entry">A secret and ancient organization that manipulates global events from the shadows. Composed of twelve anonymous members, SEELE is the true power behind NERV and the Human Instrumentality Project, guiding humanity towards its predetermined destiny.</p>
            <div class="content-section">
                <h4>Keel Lorenz</h4>
                <p>The enigmatic chairman of Seele and the main antagonist behind the Human Instrumentality Project. Often appearing only as a monolith labeled "SEELE 01," he orchestrates events from the shadows, his true motives and history shrouded in mystery.</p>
            </div>
            <div class="content-section">
                <h4>Mass Production Evangelions (MP-EVAs)</h4>
                <p>The final series of Evangelions produced by Seele. These nine units are autonomous, equipped with S² Engines, and wield large, double-bladed weapons based on the Lance of Longinus. Their most unsettling feature is their vulture-like appearance and grinning visage.</p>
            </div>
        `,
        "2ND IMPACT": `
            <h3 class="log-entry">[ SECOND IMPACT ]</h3>
            <p class="log-entry">
                A cataclysm of unprecedented scale that occurred on September 13, 2000. The event, originating in Antarctica, caused the polar ice caps to melt, leading to a rise in sea levels and a shift in the Earth's axis. The resulting climate change and geopolitical turmoil led to the death of half the world's population. While officially attributed to a 'large-scale meteorite impact,' the true cause was an accident during a contact experiment with the First Angel, 'Adam,' discovered in Antarctica. This truth is a top-secret matter known only to the highest echelons of SEELE and NERV.
                <br/><br/>
                西暦2000年9月13日に発生した未曾有の大災害。南極で発生したこの事件により、氷河が融解し海面が上昇、地軸が捻じれて地球の自転周期が変わり、それに伴う気象変動で世界的な紛争が勃発した。これにより世界人口の半分が死亡した。公式には「大質量隕石の衝突」が原因と発表されたが、実際には南極で発見された第1使徒「アダム」との接触実験中に発生した事故であった。この真実はゼーレ(SEELE)とネルフ(NERV)の最高幹部のみが知る極秘事項である。
            </p>
        `,
        "LCL": `
            <h3 class="log-entry">LCL: LINK CONNECT LIQUID</h3>
            <p class="log-entry">Link Connect Liquid (LCL) is the lifeblood of the Evangelion project. It is the orange, breathable fluid that fills the entry plug of an Evangelion. Its unique properties not only provide life support but are essential for the pilot's psychic link to the bio-mechanical giant.</p>
            <p class="log-entry">LCL acts as an electrochemical medium for neural synchronization between pilot and Evangelion. It facilitates thought-based control and provides a protective, life-sustaining environment for the pilot during combat.</p>
        `,
        "S² ENGINE": `
            <h3 class="log-entry">S² ENGINE: THE SUPER SOLENOID ENGINE</h3>
            <p class="log-entry">The Super Solenoid Engine (S² Engine) is a theoretical perpetual motion engine that grants Angels limitless energy. This makes them nearly invincible and self-sufficient, as they do not require external power sources.</p>
            <p class="log-entry">Evangelion Unit-01 is the only Eva to possess a true S² Engine, which it acquired after consuming the Angel Zeruel. This grants Unit-01 unparalleled power and operational independence compared to other Evangelion units that rely on umbilical cables or internal batteries.</p>
        `,
        "CREDITS": `
            <h3 class="log-entry">PROJECT CREDITS</h3>
            <div class="content-section">
                <h4>Creator: Hyunsoo Kim</h4>
                <p>Role: Solo Developer</p>
                <p>This fan-made project was created with a deep appreciation for Neon Genesis Evangelion, utilizing web development skills to bring an interactive experience to fellow fans.</p>
                <p>Technologies Used: React.js, GSAP, Three.js, SimplexNoise.js</p>
            </div>
            <div class="content-section">
                <h4>Music Used:</h4>
                <p>Main BGM: Dispossession / Pluck Ver. - MONACA (NieR-Automata OST)</p>
                <p>All music rights belong to their original creators.</p>
            </div>
            <p class="log-entry">*) All image sources used in this project can be downloaded from the IMAGES tab in the full application.</p>
            <p class="log-entry">**) This is a non-commercial project.</p>
        `,
        "GUESTBOOK": `
            <h3 class="log-entry">GUESTBOOK: LEAVE YOUR MARK</h3>
            <p class="log-entry">This section is an interactive guestbook where users can leave messages. In the full application, you can submit your name, a password, and a message, and also edit or delete your entries.</p>
            <p class="log-entry">This feature allows for community interaction and a personal touch to the data explorer experience.</p>
            <p class="log-entry">Please note: This is a simulated view. The actual guestbook functionality is available in the complete web application.</p>
        `
    };

    searchButton.addEventListener('click', performSearch);
    searchBar.addEventListener('input', updateAutocomplete);

    function populateSidebarMenu() {
        menuItems.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('sidebar-menu-item');
            menuItemDiv.textContent = item;
            menuItemDiv.addEventListener('click', () => {
                searchBar.value = item;
                performSearch();
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
            menuListElement.appendChild(menuItemDiv);
        });
    }

    initializeKeyboard();
    populateSidebarMenu();

    searchBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // ★★ 변경: 불필요한 자동 포커스 로직 제거
    // searchBar.focus();
    // searchBar.addEventListener('blur', () => {
    //     setTimeout(() => searchBar.focus(), 0);
    // });

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
});