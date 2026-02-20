        function syncStickyHeaderHeight() {
            const header = document.querySelector('header');
            if (!header) return;
            const headerHeight = Math.ceil(header.getBoundingClientRect().height);
            document.documentElement.style.setProperty('--sticky-header-height', `${headerHeight}px`);
        }

        window.addEventListener('load', syncStickyHeaderHeight);
        window.addEventListener('resize', syncStickyHeaderHeight);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(syncStickyHeaderHeight);
        }
        syncStickyHeaderHeight();

        const icons = {
            ticket: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                <path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
            </svg>`,
            parking: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 17V7h4a3 3 0 0 1 0 6h-4"/>
            </svg>`,
            mountain: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
            </svg>`,
            trail: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 3 C8 9, 16 12, 10 21" stroke-width="3" fill="none"/>
                <path d="M4 6 L4 10 L2 10 L4 6 L6 10 L4 10" fill="currentColor" stroke="none"/>
                <path d="M18 8 L18 12 L16 12 L18 8 L20 12 L18 12" fill="currentColor" stroke="none"/>
                <path d="M16 18 L16 22 L14 22 L16 18 L18 22 L16 22" fill="currentColor" stroke="none"/>
            </svg>`,
            park: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="8" width="16" height="8" rx="4" fill="#FF6600" stroke="#FF6600"/>
                <rect x="6" y="10" width="12" height="4" rx="2" fill="none" stroke="white" stroke-width="2"/>
            </svg>`,
            car: `<img class="resort-icon" src="new-resort-art/icons/van.png" alt="">`,
            myLocation: `<img class="resort-icon" src="new-resort-art/icons/location.png" alt="">`,
            wind: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
            </svg>`,
            thermometer: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
            </svg>`,
            lift: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="2" x2="12" y2="10"/>
                <rect x="8" y="10" width="8" height="6" rx="1"/>
                <line x1="9" y1="16" x2="9" y2="18"/>
                <line x1="15" y1="16" x2="15" y2="18"/>
                <circle cx="9" cy="19" r="1" fill="currentColor"/>
                <circle cx="15" cy="19" r="1" fill="currentColor"/>
                <line x1="2" y1="2" x2="22" y2="2"/>
            </svg>`,
            apres: `<span style="font-size: 1.2rem; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px;">🍺</span>`,
            family: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="6" r="2"/>
                <circle cx="16" cy="8" r="1.5"/>
                <path d="M8 8 L8 14 M6 11 L10 11"/>
                <path d="M16 9.5 L16 14 M14.5 11.5 L17.5 11.5"/>
                <line x1="8" y1="14" x2="6" y2="18"/>
                <line x1="8" y1="14" x2="10" y2="18"/>
                <line x1="16" y1="14" x2="14.5" y2="17"/>
                <line x1="16" y1="14" x2="17.5" y2="17"/>
            </svg>`,
            calendar: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>`
        };

        function getRatingText(rating, snowfall24h, resort) {
            const snow24h = parseInt(snowfall24h) || 0;
            const temp = resort.weather?.temp || 25;
            const wind = parseInt(resort.weather?.wind) || 10;
            const condition = (resort.weather?.condition || "").toLowerCase();
            const manualCondition = (resort.conditions || "").toLowerCase();
            const isCanada = resort.region === "canada";
            const isArcticAlert = manualCondition.includes('arctic blast');

            const heavySnow = snow24h >= 8;
            const freshPow = snow24h >= 4;
            const someSnow = snow24h >= 1;
            const freezing = temp < 20;
            const warm = temp > 35;
            const windy = wind > 20;
            const snowing = condition.includes("snow");

            const taglines = {
                5: {
                    heavySnow: ["Nuking!", "Dumping!", "Blower Pow!", "Cold Smoke!", "Face Shot City!", "Refill Mode!", "Deep Day!", "Pow Emergency!"],
                    freshPow: ["Powder Dreams!", "Freshies!", "Send It!", "Shred The Gnar!", "Stacking Laps!", "First Chair Vibes!", "Top Sheet Glow!", "Glade Time!"],
                    snowing: ["Peak Season!", "All-Time!", "Full Send!", "Primo!", "Storm Laps!", "No Brake Day!", "Legit Send!", "White Room Lite!"],
                    default: ["Bluebird!", "Hero Snow!", "Dialed In!", "Chef's Kiss!", "Carve Fest!", "Magic Carpet Legs!", "Smooth Sailing!", "Dream Cord!"]
                },
                4: {
                    freshPow: ["Shredable!", "Solid Send!", "Worth It!", "Pretty Sendy!", "Good Laps Ahead!", "Sneaky Good!", "Go Get Some!", "Get After It!"],
                    warm: ["Spring Skiing!", "Corn Snow!", "Gets It Done!", "Not Mad At It!", "Soft Turn Season!", "Slush Hero Time!", "Patio Then Laps!", "Sun And Turns!"],
                    default: ["Pretty Good!", "Decent Cord!", "Rippable!", "Respectable!", "Plenty To Love!", "Good Enough To Rip!", "Chairlift Smiles!", "Type 2 Approved!"]
                },
                3: {
                    freezing: ["Firm AF!", "Hardpack City!", "Chalky!", "East Coast Classic!", "Edge Work Day!", "Steel Edge Season!", "Carve Carefully!", "Grip It And Rip It!"],
                    windy: ["Breezy...", "Wind Affected!", "Chunder!", "Hold Your Line!", "Chair Sway Mode!", "Wind Check Required!", "Stay Centered!", "Battle The Gusts!"],
                    default: ["Mid Vibes!", "Standard Issue!", "It's... Fine!", "Meh-diocre!", "Skiable For Sure!", "Locals Will Know!", "Could Be Worse!", "Laps Are Laps!"]
                },
                2: {
                    freezing: ["Blue Ice!", "Crunchy!", "Firm And Fast!", "Chatter City!", "Edge Tune Day!", "Hockey Stop Practice!", "Knees Stay Soft!", "Grip Test!"],
                    warm: ["Slushy!", "Wet & Heavy!", "Spring Mashed Potatoes!", "Soft Bumps!", "Mashed Potato Laps!", "Soggy Send!", "Heavy Legs Ahead!", "Absorber Mode!"],
                    default: ["Spicy Snow!", "Edge Alert!", "Technical Day!", "Firm Challenge!", "Earn Your Turns!", "Character Builder!", "Pick Your Lines!", "Stay Loose!"]
                },
                1: {
                    freezing: ["Boilerplate!", "Ice Coast AF!", "Straight Ice!", "Skating Rink!", "Edge Sharpener!", "Puck Drop Conditions!", "Steel Edge Session!", "Dialed Carves Only!"],
                    warm: ["Slush Pit!", "Mashed Potatoes!", "Chunky Snowpack!", "Heavy Soup!", "Leg Day Deluxe!", "Wet Cement Turns!", "Slow Motion Send!", "Mogul Mash!"],
                    default: ["Icy AF!", "Yard Sale Vibes!", "Teeth Chatter!", "Edge Control Day!", "Respect The Ice!", "Low Tide Turns!", "Battle Laps!", "Skills Pay Bills!"]
                }
            };

            const canadaTaglines = {
                5: {
                    heavySnow: ["Maple Powder Party!", "Leaf It All Out There!", "Cold Smoke, Eh!", "Poutine-Pow Combo!", "Storm Day In Quebec!", "True North Refill!", "Deep Turns, Big Grins!", "Passport To Face Shots!"],
                    freshPow: ["Fresh Tracks, Eh!", "Maple Laps!", "Northern Hero Snow!", "Sorry, We're Sending!", "Top Sheet Stoked!", "Peak Leaf Energy!", "Corduroy To Glades!", "Legit Quebec Send!"],
                    snowing: ["Snow Globe Mode!", "Nuking North!", "Lift, Lap, Repeat!", "True North Stoke!", "Storm Chair Vibes!", "White Room, Eh!", "Big Mountain Mood!", "All Gas, No Brake!"],
                    default: ["Bluebird In The North!", "Maple Carve Day!", "Chef's Kiss, Quebec!", "Perfect Lap Energy!", "Sunny Send Session!", "Ski, Sip, Repeat!", "Polite In Line, Wild On Snow!", "Iconic Day, Eh!"]
                },
                4: {
                    freshPow: ["Sneaky Good, Eh!", "Maple Freshies!", "Pretty Dang Sendy!", "Worth The Border Drive!", "Loonie Well Spent!", "Good Legs, Good Laps!", "Northbound Stoke!", "Solid Quebec Turns!"],
                    warm: ["Soft And Sendy!", "Spring Corn Canada!", "Patio Then Piste!", "Sun On The Slopes!", "Mellow But Fun!", "Soft Turns, Big Smiles!", "Après Then More Laps!", "Gets It Done, Eh!"],
                    default: ["Very Skiable!", "Good Vibes Up North!", "Respectable Snow Day!", "Dialed Enough To Rip!", "Plenty Of Fun Here!", "Chairlift Banter Approved!", "Carve First, Snack Later!", "Leaf It Better Than Expected!"]
                },
                3: {
                    freezing: ["Firm But Friendly!", "Edge Game On!", "Quebec Chalk Day!", "Sharpen And Rip!", "Carve Class In Session!", "Grip It, Don't Quit!", "North Ice, Nice!", "Still Sending, Eh!"],
                    windy: ["Breezy Ridge Laps!", "Windy But Worth It!", "Hold The Line, Eh!", "Gusty Chair Chat!", "North Wind Challenge!", "Stance Strong!", "Patience, Then Send!", "Choppy But Skiable!"],
                    default: ["Could Be Worse, Eh!", "Middle Lane Send!", "Laps Are Still Laps!", "Decent Day Out!", "Earned Every Turn!", "Maple Mid-Pack!", "Ski It Anyway!", "Type 2 Preview!"]
                },
                2: {
                    freezing: ["Firm North Special!", "Edge Tune Reward Day!", "Slide, Grip, Smile!", "Crunchy But Chargeable!", "Carve Clean, Stay Loose!", "Ice? We Ski It!", "Chatter With Character!", "Steel Edges Save Days!", "Spicy Quebec Cord!", "Cold, Fast, Doable!"],
                    warm: ["Mashed Potato Mission!", "Soupy But Sendable!", "Soft Legs, Strong Heart!", "Bumps For Breakfast!", "Heavy Snow Hustle!", "Slush Surf Session!", "Absorber Mode, Eh!", "Wet Snow, Dry Humor!", "Soggy But Smiling!", "Spring Chaos Laps!"],
                    default: ["Not Hero Snow, Still Hero Energy!", "Today Is A Skills Day!", "Technical Turns Only!", "Find The Goods!", "Keep It Playful!", "Sharp Edges, Big Laughs!", "Character Builder North!", "One Good Run At A Time!", "Dig Deep, Keep Lapping!", "Could Be Way Worse, Eh!"]
                },
                1: {
                    freezing: ["Edge Sharpener Day!", "Polished But Skiable!", "Boilerplate Ballet!", "Micro-Carve Masterclass!", "Slow Is Smooth Today!", "Grip Game Finals!", "No Panic, Just Edges!", "Rink Vibes, Still Ripping!", "Steel Edges, Warm Hearts!", "North Ice Challenge!", "One Run, Then One More!", "Stay Centered And Send Small!"],
                    warm: ["Heavy Soup Service!", "Mashed Potato Madness!", "Slop But We Drop!", "Wet Snow Warriors!", "Leg Day Deluxe North!", "Soggy Glove Energy!", "Absorb Everything!", "Messy Turns, Good Stories!", "Slow Motion Send!", "Chowder Conditions, Still Skiing!", "Slush Circus!", "Find The Stash Pockets!"],
                    default: ["Low Tide, High Stoke!", "Rough Snow, Good Crew!", "Not Pretty, Still Plenty!", "Skill Builder Session!", "Dial It Back, Keep Lapping!", "Today's A Technique Arc!", "Respect The Surface!", "Short Turns, Big Wins!", "No Complaints, More Laps!", "Keep It Fun, Keep It Safe!", "We Still Ski, Always!", "Edges Out, Spirits Up!"]
                }
            };

            const resortCultureTaglines = {
                'tremblant': {
                    5: {
                        default: ['Pedestrian Village Flex!', 'Euro Après, East Coast Legs!', 'Tremblant Top To Bottom!'],
                        freshPow: ['Tremblant Glades Are On!', 'Village To Summit Send!']
                    },
                    4: {
                        default: ['Tremblant Cruisers, Big Smiles!', 'Worth Every Border Minute!']
                    },
                    3: {
                        default: ['Tremblant Still Delivers Laps!', 'Cruise, Snack, Repeat!']
                    },
                    2: {
                        default: ['Tremblant Technique Day!', 'Still Better Than Staying Home!']
                    },
                    1: {
                        default: ['Tremblant Tune-Up Session!', 'Short Turns, Long Stories Tonight!']
                    }
                },
                'mont-sainte-anne': {
                    5: {
                        heavySnow: ['Saint-Anne Storm Mode!', 'Beaupre Face Shot Shift!'],
                        default: ['River Views, Big Sends!', 'Saint-Anne Is Cooking!']
                    },
                    4: {
                        default: ['Saint-Anne Is In Form!', 'Steeps And Smiles!']
                    },
                    3: {
                        windy: ['St. Lawrence Wind, Still Sending!', 'Hold It High On The Ridge!'],
                        default: ['Saint-Anne Grit Day!', 'Good Legs Needed, Good Times Earned!']
                    },
                    2: {
                        default: ['Saint-Anne Edge Clinic!', 'Stay Loose, Stack Laps!']
                    },
                    1: {
                        default: ['Saint-Anne Survival Carves!', 'Technical, But We Ski It!']
                    }
                },
                'le-massif': {
                    5: {
                        heavySnow: ['Le Massif Is Nuking!', 'St. Lawrence Drop-In Day!'],
                        default: ['River-To-Ridge Rocket!', 'Le Massif Big Mountain Energy!']
                    },
                    4: {
                        default: ['Le Massif Legs Required!', 'Scenery And Speed!']
                    },
                    3: {
                        freezing: ['Massif Edge Work Masterclass!', 'Firm But Fast Above The River!'],
                        default: ['Le Massif Still Hits!', 'Earned Turns, Worth It!']
                    },
                    2: {
                        default: ['Le Massif Skills Session!', 'Steep + Spicy = Respect!']
                    },
                    1: {
                        default: ['Massif Micro-Carve Mission!', 'Dial It In And Keep Dropping!']
                    }
                },
                'mont-sutton': {
                    5: {
                        freshPow: ['Sutton Tree Skiing Jackpot!', 'Glade Day At Sutton!'],
                        default: ['Sutton Soul Day!', 'Old-School Vibes, New-School Send!']
                    },
                    4: {
                        default: ['Sutton Is Quietly Firing!', 'Glade Hunters Rejoice!']
                    },
                    3: {
                        default: ['Sutton Still Has Stashes!', 'Find The Woods, Find The Joy!']
                    },
                    2: {
                        default: ['Sutton Scavenger Hunt Day!', 'Tree Lines Or Bust!']
                    },
                    1: {
                        default: ['Sutton Soul-Builder Conditions!', 'Tight Lines, Light Feet!']
                    }
                }
            };

            const regionFilterTaglines = {
                'poconos': {
                    freshPow: ['Poconos Powder Party!', 'PA Freshies Found!', 'Poconos Is Firing!'],
                    freezing: ['Poconos Edge Day!', 'Firm But Fun In PA!', 'Poconos Carve Clinic!'],
                    warm: ['Poconos Spring Laps!', 'Soft Snow In The Poconos!', 'Sun And Slush, Still Sending!'],
                    windy: ['Poconos Wind Shift!', 'Hold Your Line In PA!', 'Breezy But Skiable!'],
                    default: ['Poconos Lap Factory!', 'Quick Drive, Big Stoke!', 'Pennsylvania Send Session!']
                },
                'catskills': {
                    freshPow: ['Catskills Fresh Track Energy!', 'Catskills Tree Stash Time!', 'Hunter To Windham Stoke!'],
                    freezing: ['Catskills Firm Classic!', 'Edge Game In The Catskills!', 'Cold Carves Upstate!'],
                    warm: ['Catskills Spring Hero Snow!', 'Soft Turns In The Catskills!', 'Patio Then Laps Upstate!'],
                    windy: ['Catskills Ridge Wind Mode!', 'Gusty But Worth It!', 'Hold Strong Upstate!'],
                    default: ['Catskills Doing Catskills Things!', 'Upstate Laps, Good Vibes!', 'Catskills Still Delivers!']
                },
                'adirondacks': {
                    heavySnow: ['Adirondacks Storm Cycle!', 'High Peak Refill!', 'ADK Deep Day!'],
                    freshPow: ['Adirondacks Freshies!', 'Adirondack Stoke Meter High!', 'North Country Powder!'],
                    freezing: ['ADK Firm And Fast!', 'Adirondack Edge Work!', 'Cold Mountain, Hot Laps!'],
                    windy: ['Adirondack Wind Check!', 'High Peak Gusts, Still Sending!', 'ADK Ridge Battle!'],
                    default: ['Adirondacks Big Mountain Mood!', 'North Country Carve Day!', 'Adirondack Laps On!']
                },
                'vermont-south': {
                    freshPow: ['Southern VT Is Cooking!', 'Green Mountain Freshies!', 'South VT Send Window Open!'],
                    freezing: ['Southern VT Chalk Mission!', 'Vermont Edge Day!', 'Carve It Clean In South VT!'],
                    warm: ['Southern VT Spring Corn!', 'Soft Turns, Maple Air!', 'Patio Laps In South VT!'],
                    default: ['Southern Vermont Still Hits!', 'Green Mountain Glide!', 'South VT Chairlift Smiles!']
                },
                'vermont-central': {
                    heavySnow: ['Central VT Storm Alert!', 'Killington Corridor Refill!', 'Central VT Is Nuking!'],
                    freshPow: ['Central VT Fresh Track Hunt!', 'Vermont Core Day!', 'Central Green Mountains Sending!'],
                    freezing: ['Central VT Technical Carves!', 'Firm, Fast, Vermont!', 'Edges Up In Central VT!'],
                    default: ['Central Vermont Means Business!', 'Big Vert, Big Legs!', 'Central VT Laps Stack Up!']
                },
                'vermont-north': {
                    heavySnow: ['Northern VT Snow Globe!', 'Jay Zone Refill!', 'North VT Deep Day!'],
                    freshPow: ['Northern VT Powder Chase!', 'Cold Smoke Up North!', 'North VT Tree Day!'],
                    freezing: ['Northern VT Ice IQ Test!', 'Firm But Legit Up North!', 'North VT Edge Masterclass!'],
                    windy: ['Northern VT Wind Hold Energy!', 'Gusts Up High, Send Down Low!', 'Ridge Wind, Still Worth It!'],
                    default: ['Northern Vermont Is On Brand!', 'North VT Core Laps!', 'Green Mountains Going Off!']
                },
                'massachusetts': {
                    freshPow: ['Mass Freshies!', 'Berkshire Stoke!', 'Mass Laps Looking Good!'],
                    freezing: ['Mass Edge Day!', 'Firm Turns In MA!', 'Wachusett Carve Session!'],
                    warm: ['Mass Spring Ski Vibes!', 'Soft Snow In The Berkshires!', 'Corn Snow Commute!'],
                    default: ['Massachusetts After-Work Send!', 'MA Laps, Full Heart!', 'Berkshire Turns Delivered!']
                },
                'connecticut': {
                    freshPow: ['Connecticut Sneaky Freshies!', 'CT Turns Are On!', 'Nutmeg State Send!'],
                    freezing: ['CT Carve Day!', 'Firm But Fun In Connecticut!', 'Sharp Edges, Small Hill Flow!'],
                    warm: ['Connecticut Spring Laps!', 'Soft Snow CT Session!', 'Quick CT Send Window!'],
                    default: ['Connecticut Still Skiing!', 'Local Hill, Big Vibes!', 'CT Laps Count Too!']
                },
                'white-mountains': {
                    heavySnow: ['White Mountains Refill!', 'Presidential Powder Pulse!', 'NH Storm Laps!'],
                    freshPow: ['White Mountains Freshies!', 'NH Glade Day!', 'Granite State Send!'],
                    freezing: ['White Mountains Ice Skills!', 'NH Firm And Fast!', 'Carve Hard In The Whites!'],
                    windy: ['White Mountains Wind Hold Mood!', 'Gusty Up Top, Send Down Low!', 'NH Ridge Wind Battle!'],
                    default: ['White Mountains Classic Day!', 'New Hampshire Laps, No Notes!', 'The Whites Are Delivering!']
                },
                'maine': {
                    heavySnow: ['Maine Storm Chaser Day!', 'Pine Tree Powder Party!', 'Maine Is Dumping!'],
                    freshPow: ['Maine Fresh Track Heaven!', 'Big Maine Energy!', 'Pine State Powder Turns!'],
                    freezing: ['Maine Edge Clinic!', 'Cold Air, Clean Carves!', 'Firm Maine Morning!'],
                    windy: ['Maine Wind And Weather!', 'Tough Weather, Tougher Skiers!', 'Coastal Gusts, Mountain Grit!'],
                    default: ['Maine Mountain Soul!', 'Pine Tree State Sends!', 'Maine Laps, Maine Legends!']
                },
                'canada': {
                    heavySnow: ['Quebec Storm Session!', 'True North Refill Cycle!'],
                    freshPow: ['Quebec Fresh Track Frenzy!', 'Maple Laps Activated!'],
                    freezing: ['Quebec Edge Tech Day!', 'Firm North, Fun North!'],
                    warm: ['Quebec Spring Corn Groove!', 'Soft North Turns!'],
                    default: ['Quebec Culture + Laps!', 'Leaf Country Stoke!']
                }
            };

            if (isArcticAlert) {
                const arcticTaglines = {
                    5: ['Arctic Hero Day ⚠️', 'Cold Smoke + Windproof Layers ⚠️', 'Face Tape Full Send ⚠️'],
                    4: ['Arctic But Rippable ⚠️', 'Bundle Up, Still Worth It ⚠️', 'Cold Air, Hot Laps ⚠️'],
                    3: ['Arctic Edge Session ⚠️', 'Frosty And Fast ⚠️', 'Neck Gaiter Game On ⚠️'],
                    2: ['Arctic Challenge Mode ⚠️', 'Windproof Everything ⚠️', 'Short Laps, Strong Coffee ⚠️'],
                    1: ['Arctic Survival Carves ⚠️', 'Goggle Ice Build-Up Day ⚠️', 'Face Mask Mandatory ⚠️']
                };
                const options = arcticTaglines[rating] || arcticTaglines[3];
                return options[Math.floor(Math.random() * options.length)];
            }

            function pickTaglineSet(pool, resortId, resortRegion) {
                let bucket = 'default';
                if (rating === 5) {
                    if (heavySnow) bucket = 'heavySnow';
                    else if (freshPow) bucket = 'freshPow';
                    else if (snowing) bucket = 'snowing';
                } else if (rating === 4) {
                    if (freshPow || someSnow) bucket = 'freshPow';
                    else if (warm) bucket = 'warm';
                } else if (rating === 3) {
                    if (freezing) bucket = 'freezing';
                    else if (windy) bucket = 'windy';
                } else if (rating === 2) {
                    if (freezing) bucket = 'freezing';
                    else if (warm) bucket = 'warm';
                } else if (rating === 1) {
                    if (freezing) bucket = 'freezing';
                    else if (warm) bucket = 'warm';
                }

                const base = pool[rating]?.[bucket] || pool[rating]?.default || ['Unknown'];
                const options = [...base];
                const resortExtras = resortCultureTaglines[resortId]?.[rating];
                const extra = resortExtras?.[bucket] || resortExtras?.default;
                if (Array.isArray(extra) && extra.length) {
                    options.push(...extra);
                }

                const regionExtras = regionFilterTaglines[resortRegion]?.[bucket]
                    || regionFilterTaglines[resortRegion]?.default;
                if (Array.isArray(regionExtras) && regionExtras.length) {
                    options.push(...regionExtras);
                }

                return options;
            }

            const selectedPool = isCanada ? canadaTaglines : taglines;
            const options = pickTaglineSet(selectedPool, resort.id, resort.region);
            return options[Math.floor(Math.random() * options.length)];
        }

        function calculateRating(weather, snowfall) {
            const safeWeather = weather || {};
            const safeSnowfall = snowfall || {};

            let score = 0;

            const snow24h = parseInt(safeSnowfall.snowfall24h ?? safeSnowfall['24h'] ?? 0, 10);
            const snow48h = parseInt(safeSnowfall.snowfall48h ?? safeSnowfall['48h'] ?? 0, 10);
            let snowScore = 0;
            if (snow24h >= 6) snowScore = 5;
            else if (snow24h >= 4) snowScore = 4;
            else if (snow24h >= 2) snowScore = 3;
            else if (snow24h >= 1) snowScore = 2;
            else snowScore = snow48h > 0 ? 2 : 1;
            score += snowScore * 0.4;

            const temp = typeof safeWeather.temp === 'number' ? safeWeather.temp : 25; // neutral default
            let tempScore = 0;
            if (temp >= 15 && temp <= 30) tempScore = 5;
            else if ((temp >= 10 && temp < 15) || (temp > 30 && temp <= 35)) tempScore = 4;
            else if ((temp >= 5 && temp < 10) || (temp > 35 && temp <= 40)) tempScore = 3;
            else if ((temp >= 0 && temp < 5) || (temp > 40 && temp <= 45)) tempScore = 2;
            else tempScore = 1;
            score += tempScore * 0.2;

            const windSpeed = parseInt(safeWeather.wind ?? 0, 10);
            let windScore = 0;
            if (windSpeed <= 10) windScore = 5;
            else if (windSpeed <= 15) windScore = 4;
            else if (windSpeed <= 20) windScore = 3;
            else if (windSpeed <= 30) windScore = 2;
            else windScore = 1;
            score += windScore * 0.2;

            const condition = (safeWeather.condition || '').toLowerCase();
            let conditionScore = 3;
            if (condition.includes('snow')) conditionScore = 5;
            else if (condition.includes('clear') || condition.includes('sun')) conditionScore = 4;
            else if (condition.includes('cloud')) conditionScore = 3;
            else if (condition.includes('rain') || condition.includes('drizzle')) conditionScore = 1;
            score += conditionScore * 0.2;

            return Math.max(1, Math.min(5, Math.round(score)));
        }

        function parsePriceToNumber(value, fallback = 999) {
            if (typeof value === 'number' && Number.isFinite(value)) return value;
            if (typeof value === 'string') {
                const parsed = parseFloat(value.replace(/[^0-9.]/g, ''));
                if (Number.isFinite(parsed)) return parsed;
            }
            return fallback;
        }

        function normalizeWeatherIcon(icon, condition) {
            const source = `${icon || ''} ${condition || ''}`.toLowerCase();
            if (source.includes('thunder') || source.includes('lightning') || source.includes('⛈')) return '⚡';
            if (source.includes('snow') || source.includes('sleet') || source.includes('flurr')) return '❄';
            if (source.includes('rain') || source.includes('drizzle') || source.includes('🌧')) return '☂';
            if (source.includes('mist') || source.includes('fog') || source.includes('haze') || source.includes('🌫')) return '☁';
            if (source.includes('clear') || source.includes('sun') || source.includes('☀')) return '☀';
            if (source.includes('partly') || source.includes('broken') || source.includes('scattered') || source.includes('⛅')) return '⛅';
            if (source.includes('cloud') || source.includes('☁')) return '☁';
            return '☁';
        }

        function normalizeSnowfall(resort) {
            if (!resort || typeof resort !== 'object') return;
            const snow24 = resort.snowfall24h ?? resort.snowfall?.['24h'] ?? 0;
            const snow48 = resort.snowfall48h ?? resort.snowfall?.['48h'] ?? 0;
            const snow7d = resort.snowfall7d ?? resort.snowfall?.['7d'] ?? 0;
            resort.snowfall24h = snow24;
            resort.snowfall48h = snow48;
            resort.snowfall7d = snow7d;
            resort.snowfall = {
                '24h': snow24,
                '48h': snow48,
                '7d': snow7d
            };
        }

        function applyStaticMountainMetrics() {
            resorts.forEach((resort) => {
                const vertical = Number(resort.vertical);
                if (Number.isFinite(vertical)) {
                    resort.elevation = { ...(resort.elevation || {}), vertical: Math.round(vertical) };
                }

                const liftsTotal = Number(resort.liftsTotal);
                if (Number.isFinite(liftsTotal) && liftsTotal > 0) {
                    if (!resort.lifts || typeof resort.lifts !== 'object') {
                        resort.lifts = {};
                    }
                    if (!Number.isFinite(Number(resort.lifts.total))) {
                        resort.lifts.total = Math.round(liftsTotal);
                    }
                    if (Number.isFinite(Number(resort.lifts.open)) && !Number.isFinite(Number(resort.lifts.closed))) {
                        resort.lifts.closed = Math.max(0, Number(resort.lifts.total) - Number(resort.lifts.open));
                    }
                }
            });
        }

        function applyManualResortOverrides() {
            const overrides =
                (typeof window !== 'undefined' && (window.MANUAL_RESORT_OVERRIDES || window.ICECOAST_MANUAL_OVERRIDES))
                || {};
            const overridesMeta =
                (typeof window !== 'undefined' && window.MANUAL_RESORT_OVERRIDES_META)
                || null;
            const fileLevelPatrolUpdatedAt =
                overridesMeta && typeof overridesMeta.updatedAt === 'string' && overridesMeta.updatedAt.trim()
                    ? overridesMeta.updatedAt
                    : null;
            if (!overrides || typeof overrides !== 'object') return;

            resorts.forEach((resort) => {
                resort.hasPatrolUpdate = false;
                resort.patrolUpdatedAt = null;
            });

            resorts.forEach((resort) => {
                const patch = overrides[resort.id];
                if (!patch || typeof patch !== 'object') return;
                if (typeof patch._patrolUpdatedAt === 'string' && patch._patrolUpdatedAt.trim()) {
                    resort.patrolUpdatedAt = patch._patrolUpdatedAt;
                } else if (fileLevelPatrolUpdatedAt) {
                    resort.patrolUpdatedAt = fileLevelPatrolUpdatedAt;
                }
                resort.hasPatrolUpdate = !!resort.patrolUpdatedAt;

                if (Number.isFinite(Number(patch.icecoastRating))) {
                    resort.manualRating = Math.max(1, Math.min(5, Number(patch.icecoastRating)));
                    resort.rating = resort.manualRating;
                }

                if (typeof patch.dynamicPricing === 'boolean') {
                    resort.dynamicPricing = patch.dynamicPricing;
                }

                if (patch.liftTicket && typeof patch.liftTicket === 'object') {
                    const weekday = patch.liftTicket.weekday ?? resort.liftTicket?.weekday ?? '—';
                    const weekend = patch.liftTicket.weekend ?? resort.liftTicket?.weekend ?? weekday;
                    resort.liftTicket = { weekday, weekend };
                }

                if (typeof patch.parking === 'string') {
                    resort.parking = patch.parking;
                }

                if (Number.isFinite(Number(patch.vertical))) {
                    resort.elevation = { ...(resort.elevation || {}), vertical: Number(patch.vertical) };
                }

                if (patch.trails && typeof patch.trails === 'object') {
                    const open = Number.isFinite(Number(patch.trails.open)) ? Number(patch.trails.open) : (resort.trails?.open ?? 0);
                    const closed = Number.isFinite(Number(patch.trails.closed)) ? Number(patch.trails.closed) : (resort.trails?.closed ?? 0);
                    const total = Number.isFinite(Number(patch.trails.total)) ? Number(patch.trails.total) : open + closed;
                    resort.trails = { open, closed, total };
                }

                if (patch.lifts && typeof patch.lifts === 'object') {
                    const open = Number.isFinite(Number(patch.lifts.open)) ? Number(patch.lifts.open) : (resort.lifts?.open ?? 0);
                    const total = Number.isFinite(Number(patch.lifts.total)) ? Number(patch.lifts.total) : (resort.lifts?.total ?? open);
                    const closed = Math.max(0, total - open);
                    resort.lifts = { open, total, closed };
                }

                if (typeof patch.conditions === 'string' && patch.conditions.trim()) {
                    resort.conditions = patch.conditions.trim();
                }

                if (Number.isFinite(Number(patch.snowfall24h))) {
                    resort.snowfall24h = Number(patch.snowfall24h);
                }
                if (Number.isFinite(Number(patch.snowfall48h))) {
                    resort.snowfall48h = Number(patch.snowfall48h);
                }
                if (Number.isFinite(Number(patch.snowfall7d))) {
                    resort.snowfall7d = Number(patch.snowfall7d);
                }

                if (Number.isFinite(Number(patch.apres))) {
                    resort.apres = Math.max(0, Math.min(5, Number(patch.apres)));
                }
                if (Number.isFinite(Number(patch.family))) {
                    resort.family = Math.max(0, Math.min(5, Number(patch.family)));
                }

                normalizeSnowfall(resort);
            });
        }

        const RESORT_PASS_MEMBERSHIP = {
            'jack-frost': ['epic'],
            'big-boulder': ['epic'],
            'hunter': ['epic'],
            'mount-snow': ['epic'],
            'okemo': ['epic'],
            'stowe': ['epic'],
            'wildcat': ['epic'],
            'sunapee': ['epic'],

            'camelback': ['ikon'],
            'blue-mountain': ['ikon'],
            'stratton': ['ikon'],
            'killington': ['ikon'],
            'pico': ['ikon'],
            'sugarbush': ['ikon'],
            'loon': ['ikon'],
            'sunday-river': ['ikon'],
            'sugarloaf': ['ikon'],
            'tremblant': ['ikon'],
            'le-massif': ['ikon'],
            'jiminy-peak': ['ikon'],

            'montage': ['indy'],
            'mohawk': ['indy'],
            'catamount': ['indy'],
            'berkshire-east': ['indy'],
            'plattekill': ['indy'],
            'jay-peak': ['indy'],
            'burke': ['indy'],
            'bolton-valley': ['indy'],
            'cannon': ['indy'],
            'black-mountain': ['indy'],
            'magic-mountain': ['indy'],
            'ragged-mountain': ['indy'],
            'waterville': ['indy'],
            'saddleback': ['indy'],
            'mont-sutton': ['indy'],
            'pats-peak': ['indy'],

            'windham': []
        };

        function applyResortPassMembership() {
            resorts.forEach((resort) => {
                const membership = RESORT_PASS_MEMBERSHIP[resort.id];
                if (Array.isArray(membership)) {
                    resort.passes = membership.slice();
                } else if (!Array.isArray(resort.passes)) {
                    resort.passes = [];
                }
            });
        }

        const RESORT_APRES_FAMILY_SCORE = {
            'camelback': { apres: 3, family: 5 },
            'blue-mountain': { apres: 3, family: 3 },
            'jack-frost': { apres: 2, family: 3 },
            'shawnee': { apres: 2, family: 4 },
            'bear-creek': { apres: 3, family: 4 },
            'elk': { apres: 2, family: 3 },
            'big-boulder': { apres: 3, family: 2 },
            'montage': { apres: 2, family: 3 },

            'hunter': { apres: 3, family: 3 },
            'windham': { apres: 3, family: 4 },
            'belleayre': { apres: 2, family: 5 },
            'plattekill': { apres: 3, family: 4 },
            'whiteface': { apres: 4, family: 4 },
            'gore-mountain': { apres: 2, family: 4 },

            'jiminy-peak': { apres: 3, family: 5 },
            'wachusett': { apres: 2, family: 4 },
            'catamount': { apres: 2, family: 4 },
            'berkshire-east': { apres: 2, family: 4 },
            'mohawk': { apres: 1, family: 4 },

            'stratton': { apres: 4, family: 4 },
            'mount-snow': { apres: 4, family: 4 },
            'killington': { apres: 5, family: 3 },
            'okemo': { apres: 3, family: 5 },
            'pico': { apres: 2, family: 4 },
            'sugarbush': { apres: 4, family: 4 },
            'mad-river-glen': { apres: 2, family: 2 },
            'stowe': { apres: 5, family: 4 },
            'smugglers-notch': { apres: 2, family: 5 },
            'jay-peak': { apres: 3, family: 4 },
            'burke': { apres: 2, family: 3 },
            'bolton-valley': { apres: 2, family: 4 },

            'loon': { apres: 3, family: 4 },
            'brettonwoods': { apres: 3, family: 5 },
            'waterville': { apres: 3, family: 4 },
            'cannon': { apres: 1, family: 3 },
            'wildcat': { apres: 1, family: 2 },
            'black-mountain': { apres: 2, family: 4 },
            'magic-mountain': { apres: 3, family: 2 },
            'ragged-mountain': { apres: 2, family: 5 },
            'sunapee': { apres: 2, family: 4 },
            'pats-peak': { apres: 2, family: 5 },
            'sunday-river': { apres: 4, family: 5 },
            'sugarloaf': { apres: 4, family: 4 },
            'saddleback': { apres: 2, family: 3 },

            'tremblant': { apres: 5, family: 5 },
            'mont-sainte-anne': { apres: 3, family: 4 },
            'le-massif': { apres: 2, family: 3 },
            'mont-sutton': { apres: 3, family: 4 }
        };

        function applyResortApresFamilyScores() {
            resorts.forEach((resort) => {
                const score = RESORT_APRES_FAMILY_SCORE[resort.id];
                if (!score) return;

                if (Number.isFinite(Number(score.apres))) {
                    resort.apres = Math.max(0, Math.min(5, Number(score.apres)));
                }
                if (Number.isFinite(Number(score.family))) {
                    resort.family = Math.max(0, Math.min(5, Number(score.family)));
                }
            });
        }

        const RESORT_GLADE_SCORE = {
            'camelback': 1,
            'blue-mountain': 1,
            'jack-frost': 0,
            'shawnee': 1,
            'bear-creek': 0,
            'elk': 1,
            'big-boulder': 0,
            'montage': 1,

            'hunter': 2,
            'windham': 1,
            'belleayre': 2,
            'plattekill': 3,
            'whiteface': 3,
            'gore-mountain': 3,

            'jiminy-peak': 1,
            'wachusett': 0,
            'catamount': 1,
            'berkshire-east': 1,
            'mohawk': 1,

            'stratton': 2,
            'mount-snow': 1,
            'killington': 2,
            'okemo': 1,
            'pico': 2,
            'sugarbush': 3,
            'mad-river-glen': 3,
            'stowe': 3,
            'smugglers-notch': 3,
            'jay-peak': 3,
            'burke': 2,
            'bolton-valley': 3,

            'loon': 2,
            'brettonwoods': 2,
            'waterville': 2,
            'cannon': 2,
            'wildcat': 3,
            'black-mountain': 2,
            'magic-mountain': 3,
            'ragged-mountain': 2,
            'sunapee': 1,
            'pats-peak': 0,
            'sunday-river': 2,
            'sugarloaf': 3,
            'saddleback': 3,

            'tremblant': 2,
            'mont-sainte-anne': 2,
            'le-massif': 3,
            'mont-sutton': 3
        };

        function applyResortGladeScores() {
            resorts.forEach((resort) => {
                const mapped = RESORT_GLADE_SCORE[resort.id];
                if (Number.isFinite(mapped)) {
                    resort.glades = mapped;
                } else if (!Number.isFinite(resort.glades)) {
                    resort.glades = 0;
                }
            });
        }
        const REGION_DRIVE_TIMES = {
            'poconos': { 'NYC': '1h 50m', 'Philadelphia': '1h 45m', 'Newark': '1h 35m' },
            'catskills': { 'NYC': '2h 30m', 'Albany': '1h 10m', 'Newark': '2h 40m' },
            'adirondacks': { 'Albany': '1h 50m', 'Montreal': '2h 10m', 'NYC': '5h 10m' },
            'massachusetts': { 'Boston': '2h 20m', 'NYC': '3h 15m', 'Albany': '1h 00m' },
            'connecticut': { 'Hartford': '1h 10m', 'NYC': '2h 15m', 'Boston': '2h 30m' },
            'vermont-south': { 'NYC': '4h 00m', 'Boston': '3h 00m', 'Albany': '2h 20m' },
            'vermont-central': { 'Boston': '3h 25m', 'NYC': '4h 45m', 'Montreal': '2h 30m' },
            'vermont-north': { 'Montreal': '1h 40m', 'Boston': '3h 45m', 'NYC': '5h 25m' },
            'white-mountains': { 'Boston': '2h 20m', 'Portland': '1h 35m', 'NYC': '5h 10m' },
            'maine': { 'Portland': '1h 45m', 'Boston': '3h 20m', 'Montreal': '4h 25m' },
            'canada': { 'Montreal': '1h 35m', 'Quebec City': '1h 20m', 'Burlington': '2h 35m' },
        };

        const RESORT_DRIVE_TIME_OVERRIDES = {
            'camelback': { 'NYC': '1h 50m', 'Philadelphia': '1h 55m', 'Newark': '1h 30m' },
            'blue-mountain': { 'NYC': '2h 00m', 'Philadelphia': '1h 35m', 'Newark': '1h 40m' },
            'jack-frost': { 'NYC': '2h 00m', 'Philadelphia': '2h 00m', 'Newark': '1h 40m' },
            'shawnee': { 'NYC': '1h 30m', 'Philadelphia': '1h 50m', 'Newark': '1h 10m' },
            'bear-creek': { 'NYC': '2h 25m', 'Philadelphia': '1h 45m', 'Newark': '2h 10m' },
            'elk': { 'NYC': '2h 25m', 'Philadelphia': '2h 45m', 'Newark': '2h 05m' },
            'big-boulder': { 'NYC': '2h 05m', 'Philadelphia': '2h 00m', 'Newark': '1h 45m' },
            'montage': { 'NYC': '2h 10m', 'Philadelphia': '2h 10m', 'Newark': '1h 50m' },
            'hunter': { 'NYC': '2h 25m', 'Albany': '0h 55m', 'Newark': '2h 15m' },
            'windham': { 'NYC': '2h 35m', 'Albany': '0h 50m', 'Newark': '2h 25m' },
            'belleayre': { 'NYC': '2h 20m', 'Albany': '1h 15m', 'Newark': '2h 10m' },
            'plattekill': { 'NYC': '2h 50m', 'Albany': '1h 20m', 'Newark': '2h 40m' },
            'whiteface': { 'Albany': '2h 50m', 'Montreal': '2h 15m', 'NYC': '5h 25m' },
            'gore-mountain': { 'Albany': '1h 45m', 'Montreal': '3h 00m', 'NYC': '4h 20m' },
            'jiminy-peak': { 'Boston': '2h 40m', 'NYC': '3h 00m', 'Albany': '0h 35m' },
            'wachusett': { 'Boston': '1h 10m', 'NYC': '3h 35m', 'Albany': '2h 05m' },
            'catamount': { 'Albany': '1h 05m', 'NYC': '2h 20m', 'Boston': '2h 35m' },
            'berkshire-east': { 'Albany': '1h 20m', 'Boston': '2h 25m', 'NYC': '3h 10m' },
            'mohawk': { 'Hartford': '0h 50m', 'NYC': '1h 55m', 'Boston': '2h 50m' },
            'stratton': { 'NYC': '3h 40m', 'Boston': '2h 30m', 'Albany': '1h 20m' },
            'mount-snow': { 'NYC': '3h 40m', 'Boston': '2h 25m', 'Albany': '1h 10m' },
            'killington': { 'Boston': '2h 55m', 'NYC': '4h 30m', 'Montreal': '3h 10m' },
            'okemo': { 'NYC': '4h 10m', 'Boston': '2h 35m', 'Albany': '1h 45m' },
            'pico': { 'Boston': '3h 00m', 'NYC': '4h 30m', 'Montreal': '3h 05m' },
            'sugarbush': { 'Boston': '3h 25m', 'NYC': '5h 10m', 'Montreal': '2h 25m' },
            'mad-river-glen': { 'Boston': '3h 30m', 'NYC': '5h 15m', 'Montreal': '2h 15m' },
            'stowe': { 'Montreal': '2h 00m', 'Boston': '3h 45m', 'NYC': '5h 45m' },
            'smugglers-notch': { 'Montreal': '2h 00m', 'Boston': '3h 45m', 'NYC': '5h 45m' },
            'jay-peak': { 'Montreal': '1h 55m', 'Boston': '4h 15m', 'NYC': '6h 30m' },
            'burke': { 'Montreal': '2h 30m', 'Boston': '3h 35m', 'NYC': '6h 05m' },
            'bolton-valley': { 'Montreal': '1h 45m', 'Boston': '3h 35m', 'NYC': '5h 35m' },
            'loon': { 'Boston': '2h 15m', 'Portland': '1h 50m', 'NYC': '5h 20m' },
            'brettonwoods': { 'Boston': '3h 00m', 'Portland': '2h 15m', 'NYC': '5h 40m' },
            'waterville': { 'Boston': '2h 05m', 'Portland': '2h 10m', 'NYC': '5h 10m' },
            'cannon': { 'Boston': '2h 30m', 'Portland': '2h 20m', 'NYC': '5h 25m' },
            'wildcat': { 'Boston': '3h 20m', 'Portland': '2h 10m', 'NYC': '5h 50m' },
            'black-mountain': { 'Boston': '2h 45m', 'Portland': '1h 45m', 'NYC': '5h 45m' },
            'magic-mountain': { 'NYC': '3h 50m', 'Boston': '2h 35m', 'Albany': '1h 20m' },
            'ragged-mountain': { 'Boston': '1h 55m', 'Portland': '2h 00m', 'NYC': '4h 50m' },
            'sunapee': { 'Boston': '1h 50m', 'Portland': '2h 35m', 'NYC': '4h 45m' },
            'pats-peak': { 'Boston': '1h 25m', 'Portland': '2h 00m', 'NYC': '4h 35m' },
            'sunday-river': { 'Portland': '1h 35m', 'Boston': '3h 20m', 'Montreal': '3h 25m' },
            'sugarloaf': { 'Portland': '2h 20m', 'Boston': '4h 10m', 'Montreal': '3h 45m' },
            'saddleback': { 'Portland': '2h 15m', 'Boston': '3h 55m', 'Montreal': '3h 35m' },
            'tremblant': { 'Montreal': '1h 50m', 'Quebec City': '3h 40m', 'Burlington': '3h 05m' },
            'mont-sainte-anne': { 'Montreal': '3h 45m', 'Quebec City': '0h 35m', 'Burlington': '4h 30m' },
            'le-massif': { 'Montreal': '4h 05m', 'Quebec City': '1h 15m', 'Burlington': '5h 05m' },
            'mont-sutton': { 'Montreal': '1h 40m', 'Quebec City': '3h 00m', 'Burlington': '1h 25m' },
        };

        function applyResortDriveTimes() {
            resorts.forEach((resort) => {
                const override = RESORT_DRIVE_TIME_OVERRIDES[resort.id];
                if (override && typeof override === 'object') {
                    resort.distance = { ...override };
                    return;
                }

                const regional = REGION_DRIVE_TIMES[resort.region];
                if (regional && typeof regional === 'object') {
                    resort.distance = { ...regional };
                } else if (!resort.distance || typeof resort.distance !== 'object') {
                    resort.distance = {};
                }
            });
        }

        function parseDriveTimeMinutes(value) {
            const raw = String(value || '').trim().toLowerCase();
            const hoursMatch = raw.match(/(\d+)\s*h/);
            const minsMatch = raw.match(/(\d+)\s*m/);
            const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
            const mins = minsMatch ? Number(minsMatch[1]) : 0;
            const total = (hours * 60) + mins;
            return Number.isFinite(total) && total > 0 ? total : Number.POSITIVE_INFINITY;
        }

        const ETA_USAGE_STORAGE_KEY = 'icecoast_eta_usage_state_v1';
        const ETA_DEFAULT_CONFIG = {
            enabled: true,
            killSwitch: false,
            maxCallsPerDay: 300,
            maxCallsPerMonth: 8000,
            cacheMinutes: 10,
            timeoutMs: 9000
        };
        const ETA_CONFIG = {
            ...ETA_DEFAULT_CONFIG,
            ...((typeof window !== 'undefined' && window.ICECOAST_ETA_CONFIG && typeof window.ICECOAST_ETA_CONFIG === 'object')
                ? window.ICECOAST_ETA_CONFIG
                : {})
        };
        const ETA_CACHE_TTL_MS = Math.max(1, Number(ETA_CONFIG.cacheMinutes || 10)) * 60 * 1000;
        const etaStateByResort = {};

        function formatEtaMinutes(totalMinutes) {
            if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return '—';
            const rounded = Math.max(1, Math.round(totalMinutes / 5) * 5);
            const hours = Math.floor(rounded / 60);
            const mins = rounded % 60;
            return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        }

        function parseIsoDurationMinutes(isoDuration) {
            const raw = String(isoDuration || '').trim();
            const match = raw.match(/^(\d+(?:\.\d+)?)s$/i);
            if (!match) return null;
            const seconds = Number(match[1]);
            if (!Number.isFinite(seconds) || seconds <= 0) return null;
            return Math.max(1, Math.round(seconds / 60));
        }

        function getUsageDateKey() {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }

        function getUsageMonthKey() {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }

        function loadEtaUsageState() {
            if (typeof localStorage === 'undefined') {
                return { dayKey: getUsageDateKey(), monthKey: getUsageMonthKey(), dayCount: 0, monthCount: 0 };
            }
            try {
                const raw = localStorage.getItem(ETA_USAGE_STORAGE_KEY);
                const parsed = raw ? JSON.parse(raw) : {};
                return {
                    dayKey: parsed.dayKey || getUsageDateKey(),
                    monthKey: parsed.monthKey || getUsageMonthKey(),
                    dayCount: Number(parsed.dayCount) || 0,
                    monthCount: Number(parsed.monthCount) || 0
                };
            } catch (_) {
                return { dayKey: getUsageDateKey(), monthKey: getUsageMonthKey(), dayCount: 0, monthCount: 0 };
            }
        }

        function saveEtaUsageState(state) {
            if (typeof localStorage === 'undefined') return;
            try {
                localStorage.setItem(ETA_USAGE_STORAGE_KEY, JSON.stringify(state));
            } catch (_) {
                // no-op
            }
        }

        function normalizeEtaUsageState(state) {
            const next = { ...state };
            const currentDay = getUsageDateKey();
            const currentMonth = getUsageMonthKey();
            if (next.monthKey !== currentMonth) {
                next.monthKey = currentMonth;
                next.monthCount = 0;
                next.dayKey = currentDay;
                next.dayCount = 0;
            } else if (next.dayKey !== currentDay) {
                next.dayKey = currentDay;
                next.dayCount = 0;
            }
            return next;
        }

        function getEtaUsageBudgetStatus() {
            let usage = normalizeEtaUsageState(loadEtaUsageState());
            saveEtaUsageState(usage);
            if (!ETA_CONFIG.enabled || ETA_CONFIG.killSwitch) {
                return { allowed: false, reason: 'disabled' };
            }
            const dayLimit = Number(ETA_CONFIG.maxCallsPerDay);
            const monthLimit = Number(ETA_CONFIG.maxCallsPerMonth);
            if (Number.isFinite(dayLimit) && dayLimit > 0 && usage.dayCount >= dayLimit) {
                return { allowed: false, reason: 'daily_cap' };
            }
            if (Number.isFinite(monthLimit) && monthLimit > 0 && usage.monthCount >= monthLimit) {
                return { allowed: false, reason: 'monthly_cap' };
            }
            return { allowed: true, usage };
        }

        function incrementEtaUsage() {
            let usage = normalizeEtaUsageState(loadEtaUsageState());
            usage.dayCount += 1;
            usage.monthCount += 1;
            saveEtaUsageState(usage);
        }

        function getEtaDisabledMessage(reason) {
            if (reason === 'daily_cap' || reason === 'monthly_cap') {
                return 'Live ETA cap reached. Using static drive times.';
            }
            return 'Live ETA is currently off. Using static drive times.';
        }

        function getOriginHash(lat, lon) {
            return `${lat.toFixed(2)},${lon.toFixed(2)}`;
        }

        function getCachedEtaState(resortId, originHash) {
            const state = etaStateByResort[resortId];
            if (!state || state.status !== 'ok' || !state.timestamp) return null;
            if (state.originHash !== originHash) return null;
            if ((Date.now() - state.timestamp) > ETA_CACHE_TTL_MS) return null;
            return state;
        }

        function getCurrentPositionAsync() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation unavailable'));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    maximumAge: 120000,
                    timeout: 8000
                });
            });
        }

        async function fetchGoogleRouteEtaMinutes(originLat, originLon, destinationLat, destinationLon) {
            const budget = getEtaUsageBudgetStatus();
            if (!budget.allowed) {
                throw new Error(`ETA_DISABLED:${budget.reason}`);
            }

            incrementEtaUsage();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), Number(ETA_CONFIG.timeoutMs || 9000));
            try {
                const etaUrl = new URL('eta', WORKER_URL).toString();
                const resp = await fetch(etaUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        originLat,
                        originLon,
                        destinationLat,
                        destinationLon
                    }),
                    signal: controller.signal
                });

                if (!resp.ok) {
                    let payload = null;
                    try {
                        payload = await resp.json();
                    } catch (_) {
                        payload = null;
                    }
                    if (resp.status === 429 && payload?.reason) {
                        throw new Error(`ETA_DISABLED:${payload.reason}`);
                    }
                    throw new Error(`ETA_HTTP_${resp.status}`);
                }
                const data = await resp.json();
                const minutes = Number(data?.etaMinutes);
                if (!Number.isFinite(minutes)) {
                    throw new Error('ETA_PARSE');
                }
                return minutes;
            } finally {
                clearTimeout(timeoutId);
            }
        }

        async function requestResortEta(resortId) {
            const resort = resorts.find((r) => r.id === resortId);
            if (!resort || !Number.isFinite(Number(resort.lat)) || !Number.isFinite(Number(resort.lon))) {
                etaStateByResort[resortId] = { status: 'error', message: 'ETA unavailable for this resort.' };
                renderResorts();
                return;
            }

            const budget = getEtaUsageBudgetStatus();
            if (!budget.allowed) {
                etaStateByResort[resortId] = { status: 'disabled', message: getEtaDisabledMessage(budget.reason) };
                renderResorts();
                return;
            }

            etaStateByResort[resortId] = { status: 'loading', message: 'Getting live ETA…' };
            renderResorts();

            try {
                const position = await getCurrentPositionAsync();
                const originLat = Number(position.coords.latitude);
                const originLon = Number(position.coords.longitude);
                const originHash = getOriginHash(originLat, originLon);
                const cached = getCachedEtaState(resortId, originHash);
                if (cached) {
                    etaStateByResort[resortId] = { ...cached, message: `ETA now: ${cached.etaLabel}` };
                    renderResorts();
                    return;
                }

                const etaMinutes = await fetchGoogleRouteEtaMinutes(
                    originLat,
                    originLon,
                    Number(resort.lat),
                    Number(resort.lon)
                );
                const etaLabel = formatEtaMinutes(etaMinutes);
                etaStateByResort[resortId] = {
                    status: 'ok',
                    etaMinutes,
                    etaLabel,
                    originHash,
                    timestamp: Date.now(),
                    message: `ETA now: ${etaLabel}`
                };
            } catch (error) {
                const msg = String(error?.message || '');
                if (msg.startsWith('ETA_DISABLED:')) {
                    etaStateByResort[resortId] = { status: 'disabled', message: getEtaDisabledMessage(msg.split(':')[1]) };
                } else if (msg.includes('Geolocation')) {
                    etaStateByResort[resortId] = { status: 'error', message: 'Location access needed for live ETA.' };
                } else {
                    etaStateByResort[resortId] = { status: 'error', message: 'Live ETA unavailable. Using static drive times.' };
                }
            }

            renderResorts();
        }

        const DEFAULT_SEND_IT_RADIUS_MILES = 1.5;
        let sendItSummaryByResort = {};
        let sendItRadiusMiles = DEFAULT_SEND_IT_RADIUS_MILES;
        let sendItRadiusOverrides = {};
        let sendItCooldownMinutes = 20;
        let sendItCooldownOverrides = {};
        let sendItCooldownUntilByResort = {};
        let sendItMaxAccuracyMeters = 200;
        const SENDIT_DEVICE_ID_KEY = 'icecoast_sendit_device_id';
        const SENDIT_COOLDOWN_STATE_KEY = 'icecoast_sendit_cooldown_until';
        const sendItUnlockedResorts = new Set();
        const SENDIT_TEST_UNLOCKED_RESORTS = new Set([]);
        const sendItButtonCopyByResort = {};
        const sendItVerifyFlavorByResort = {};
        const sendItStateLabelByResort = {};
        const sendItCooldownCtaByResort = {};
        const sendItPostVoteAwaitByResort = {};
        const SENDIT_TEST_UNLIMITED_RESORTS = new Set([]);
        const SENDIT_TEST_ON_MOUNTAIN_RESORTS = new Set([]);
        const SENDIT_TEST_UNLOCK_ONLY_RESORTS = new Set([]);
        const DEFAULT_LIFT_CLOSE_HOUR = 16;
        const NIGHT_SKI_CLOSE_HOURS = {
            camelback: { weekday: 21, weekend: 21 },
            'blue-mountain': { weekday: 21, weekend: 22 },
            'jack-frost': { weekday: 21, weekend: 21 },
            shawnee: { weekday: 21, weekend: 21 },
            'bear-creek': { weekday: 21, weekend: 21 },
            'big-boulder': { weekday: 20, weekend: 20 },
            montage: { weekday: 21, weekend: 21 },
            hunter: { weekday: 20, weekend: 21 },
            windham: { weekday: 20, weekend: 21 },
            belleayre: { weekday: 20, weekend: 20 },
            wachusett: { weekday: 21, weekend: 21 },
            mohawk: { weekday: 21, weekend: 21 },
            'jiminy-peak': { weekday: 21, weekend: 22 }
        };

        const SENDIT_LOW_OPTIONS = ['Sharpen Edges', 'Edge Tune', 'Low Tide'];
        const SENDIT_MID_OPTIONS = ['Good Laps', 'Hot Laps', 'Prime Time'];
        const SENDIT_HIGH_OPTIONS = ['Full Send', 'Warp Speed', 'Full Tilt'];
        const SENDIT_CROWD_OPTIONS = [
            { key: 'swarm', label: 'Crowded' },
            { key: 'normal', label: 'Normal' },
            { key: 'quiet', label: 'Quiet' }
        ];
        const SENDIT_WIND_OPTIONS = [
            { key: 'nuking', label: 'Blasting' },
            { key: 'breezy', label: 'Breezy' },
            { key: 'calm', label: 'Calm' }
        ];
        const SENDIT_SLOPE_OPTIONS = [
            { key: 'edges', label: 'Sharpen Edges' },
            { key: 'good', label: 'Good Laps' },
            { key: 'full', label: 'Full Send' }
        ];
        const SENDIT_HAZARD_OPTIONS = [
            { key: 'icy', label: 'Icy' },
            { key: 'swarm', label: 'Jerry Swarm' },
            { key: 'clear', label: 'All Clear' }
        ];
        const SENDIT_COOLDOWN_CTA_OPTIONS = [
            'SEND NEW SIGNAL',
            'DROP ANOTHER SIGNAL',
            'CAST SLOPE SIGNAL',
            'RELOAD SIGNAL'
        ];
        const SENDIT_DIFFICULTY_OPTIONS = [
            { key: 'green', label: '●', score: 20, title: 'Green Circle' },
            { key: 'blue', label: '■', score: 60, title: 'Blue Square' },
            { key: 'black', label: '◆', score: 80, title: 'Black Diamond' },
            { key: 'double', label: '◆◆', score: 100, title: 'Double Black' }
        ];
        const SENDIT_GROUP_ORDER = ['wind', 'crowd', 'hazard', 'slope'];
        const SENDIT_GROUP_META = {
            wind: { icon: '🌬️', label: 'Wind' },
            crowd: { icon: '🚡', label: 'Crowd' },
            hazard: { icon: '⚠️', label: 'Hazard' },
            slope: { icon: '⛷️', label: 'Snow' }
        };
        const SENDIT_GROUP_ICON_PATHS = {
            wind: './slope-signal-lab-2d/assets/wind.png',
            crowd: './slope-signal-lab-2d/assets/lift.png',
            hazard: './slope-signal-lab-2d/assets/caution.png',
            slope: './slope-signal-lab-2d/assets/slope.png'
        };
        const SENDIT_DEFAULT_SIGNALS = { crowd: 'normal', wind: 'breezy', slope: 'good', hazard: 'clear', difficulty: '' };
        const SENDIT_HISTORY_MIN_VOTES = 1;
        const SENDIT_PAYOFF_PHRASES = {
            nodata: [
                'First Chair',
                'Be The First To Call It',
                'Fresh Slate',
                'Waiting On The First Drop'
            ],
            low: [
                'Sharpen Those Edges',
                'Survival Turns',
                'Refreeze Roulette',
                'Edge Work Day',
                'Boilerplate Ballet',
                'Firm But Skiable'
            ],
            mid: [
                'Good Turns Ahead',
                'Good Laps',
                'Hot Laps',
                'Prime Time',
                'Carve Mode',
                'Send-Ish Conditions'
            ],
            high: [
                'Full Send',
                'Full Tilt',
                'Warp Speed',
                'Storm Day Stoke',
                'Unreal Laps',
                'Hammer Time'
            ]
        };
        const SENDIT_24H_SUMMARY_BY_REGION = {
            default: {
                high: [
                    'Locals called a heater window. Legs might not survive.',
                    'Chair-to-lap momentum all day. Keep snacks in the pocket.',
                    'Home mountain energy is peaking. No wasted turns.'
                ],
                mid: [
                    'Solid local read: pick your lines and stack clean laps.',
                    'Locals are finding good turns if you stay a little patient.',
                    'Not a hero day, but very skiable with smart choices.'
                ],
                low: [
                    'Local read says tune day: edge control and short-turn style.',
                    'Survival snow with character. Keep it playful and low ego.',
                    'Firm vibes reported. Technical laps, good stories later.'
                ],
                fallback: [
                    'No local reads yet. First Chair energy is still on the table.',
                    'Fresh slate from locals today. Drop the first signal.',
                    'No crowd signal yet. Be the one who sets the tone.'
                ]
            },
            poconos: {
                high: ['Poconos locals say go now. Fast laps, no excuses.'],
                mid: ['Poconos read is decent: pick the right pod and keep moving.'],
                low: ['Poconos locals called it spicy. Sharpen edges, then send small.'],
                fallback: ['No local read yet in the Poconos. First Chair is up for grabs.']
            },
            catskills: {
                high: ['Catskills locals are on it. Quick chairs, quicker turns.'],
                mid: ['Catskills report says good-enough stoke if you stay nimble.'],
                low: ['Catskills locals called a technical day. Clean carves win.'],
                fallback: ['No Catskills local read yet. Someone call first tracks.']
            },
            adirondacks: {
                high: ['Adirondack locals called a proper send window.'],
                mid: ['ADK local read: steady laps with smart terrain picks.'],
                low: ['ADK locals say bring edge discipline and patience.'],
                fallback: ['No Adirondack read yet. First Chair still open.']
            },
            'vermont-south': {
                high: ['Southern VT locals are firing. Classic Green Mountain day.'],
                mid: ['Southern VT read says solid turns if you hunt the goods.'],
                low: ['Southern VT locals called it firm. Technique over chaos.'],
                fallback: ['No Southern VT local read yet. Be first to call it.']
            },
            'vermont-central': {
                high: ['Central VT locals report all-gas laps. Bring your legs.'],
                mid: ['Central VT read: good turns around if you stay selective.'],
                low: ['Central VT locals called an edge day. Keep it precise.'],
                fallback: ['No Central VT local read yet. First Chair is yours.']
            },
            'vermont-north': {
                high: ['Northern VT locals called a big day. Full mountain mood.'],
                mid: ['Northern VT read says steady stoke with careful line choice.'],
                low: ['Northern VT locals say tough surface, still worth laps.'],
                fallback: ['No Northern VT local read yet. Set the first signal.']
            },
            'white-mountains': {
                high: ['White Mountains locals are green-lighting lap season today.'],
                mid: ['White Mountains read is workable: hunt good snow, skip junk.'],
                low: ['White Mountains locals called a grip-and-rip day.'],
                fallback: ['No White Mountains local read yet. First Chair available.']
            },
            maine: {
                high: ['Maine locals called a beauty window. Keep the chair turning.'],
                mid: ['Maine read says good laps if you stay adaptable.'],
                low: ['Maine locals reported firm spice. Ski smart, still ski.'],
                fallback: ['No Maine local read yet. Someone drop the first call.']
            },
            canada: {
                high: ['Quebec locals called a full-send day, eh.'],
                mid: ['Quebec read says good turns with a little patience.'],
                low: ['Quebec locals say edge game first, then après.'],
                fallback: ['No Quebec local read yet. First Chair is wide open.']
            }
        };
        const sendItSignalSelectionByResort = {};
        const sendItReadySlamByResort = {};
        const sendItUnlockTransitionByResort = {};
        const SENDIT_COOLDOWN_OPTIONS = [
            'Easy, legend. icecoast patrol says wait {minutes}m before your next call.',
            'You already dropped your vote. Take a hot-lap and check back in {minutes}m.',
            'Apres timeout: bar tab open, voting tab paused for {minutes}m.',
            'Chairlift gossip is still processing your vote. Try again in {minutes}m.',
            'Save some ammo for second chair. You can vote again in {minutes}m.',
            'Boots still clicking at the lodge. Next vote opens in {minutes}m.',
            'No double-dipping the nachos or the votes. Retry in {minutes}m.',
            'Wax room says chill for {minutes}m, then fire another take.',
            'Apres committee heard you loud and clear. Come back in {minutes}m.',
            'One vote per lap, boss. Next lap opens in {minutes}m.'
        ];
        const SENDIT_VERIFY_TAGLINES = [
            'Call your line.',
            'Let it rip.',
            'Drop your take.',
            'Point em downhill.',
            'Send your call.',
            'Choose your line.',
            'Set your edge.',
            'Claim your lap.',
            'Call the snow.',
            'Make the call.'
        ];
        const SENDIT_OUT_OF_RANGE_OPTIONS = [
            'You are {distance} miles away. Time to shuffle over on skinny skis, nordic warrior.',
            'You are {distance} miles away. You are currently in cross-country mode, not chairlift mode.',
            'You are {distance} miles away. Grab the classic wax and start double-poling.',
            'You are {distance} miles away. That is a little too far for a quick bootpack.',
            'You are {distance} miles away. Respectfully: skate-ski closer and then drop your take.',
            'You are {distance} miles away. icecoast patrol says this is a touring mission, not an on-mountain check-in.'
        ];

        function pickRandomLabel(options) {
            return options[Math.floor(Math.random() * options.length)];
        }

        function getSendItTierOptions(tier) {
            if (tier === 'low') return SENDIT_LOW_OPTIONS;
            if (tier === 'mid') return SENDIT_MID_OPTIONS;
            return SENDIT_HIGH_OPTIONS;
        }

        function getSendItStateLabelForResort(resortId, tier) {
            const key = resortId || 'global';
            if (!sendItStateLabelByResort[key]) {
                sendItStateLabelByResort[key] = {};
            }
            if (!sendItStateLabelByResort[key][tier]) {
                sendItStateLabelByResort[key][tier] = pickRandomLabel(getSendItTierOptions(tier));
            }
            return sendItStateLabelByResort[key][tier];
        }

        function getSendItButtonCopy(resortId) {
            if (!sendItButtonCopyByResort[resortId]) {
                sendItButtonCopyByResort[resortId] = {
                    low: getSendItStateLabelForResort(resortId, 'low'),
                    mid: getSendItStateLabelForResort(resortId, 'mid'),
                    high: getSendItStateLabelForResort(resortId, 'high')
                };
            }
            return sendItButtonCopyByResort[resortId];
        }

        function getSendItCooldownMessage(retryAfterMinutes) {
            const minutes = Math.max(1, Math.round(Number(retryAfterMinutes) || 1));
            const template = pickRandomLabel(SENDIT_COOLDOWN_OPTIONS);
            return template.replace('{minutes}', `${minutes}`);
        }

        function isValidSendItCrowd(value) {
            return SENDIT_CROWD_OPTIONS.some((opt) => opt.key === value);
        }

        function isValidSendItWind(value) {
            return SENDIT_WIND_OPTIONS.some((opt) => opt.key === value);
        }

        function isValidSendItSlope(value) {
            return SENDIT_SLOPE_OPTIONS.some((opt) => opt.key === value);
        }

        function isValidSendItHazard(value) {
            return SENDIT_HAZARD_OPTIONS.some((opt) => opt.key === value);
        }

        function isValidSendItDifficulty(value) {
            return SENDIT_DIFFICULTY_OPTIONS.some((opt) => opt.key === value);
        }

        function getSendItCrowdLabel(value) {
            const match = SENDIT_CROWD_OPTIONS.find((opt) => opt.key === value);
            return match ? match.label : 'Normal';
        }

        function getSendItWindLabel(value) {
            const match = SENDIT_WIND_OPTIONS.find((opt) => opt.key === value);
            return match ? match.label : 'Breezy';
        }

        function getSendItSignalSelection(resortId) {
            const existing = sendItSignalSelectionByResort[resortId];
            if (existing) return existing;
            const fromSummary = sendItSummaryByResort?.[resortId] || {};
            const seeded = {
                crowd: isValidSendItCrowd(fromSummary.crowdMode) ? fromSummary.crowdMode : SENDIT_DEFAULT_SIGNALS.crowd,
                wind: isValidSendItWind(fromSummary.windMode) ? fromSummary.windMode : SENDIT_DEFAULT_SIGNALS.wind,
                slope: SENDIT_DEFAULT_SIGNALS.slope,
                hazard: SENDIT_DEFAULT_SIGNALS.hazard,
                difficulty: SENDIT_DEFAULT_SIGNALS.difficulty,
                activeGroup: SENDIT_GROUP_ORDER[0]
            };
            sendItSignalSelectionByResort[resortId] = seeded;
            return seeded;
        }

        function setSendItSignalSelection(resortId, key, value) {
            if (key === 'crowd' && !isValidSendItCrowd(value)) return;
            if (key === 'wind' && !isValidSendItWind(value)) return;
            if (key === 'slope' && !isValidSendItSlope(value)) return;
            if (key === 'hazard' && !isValidSendItHazard(value)) return;
            if (key === 'difficulty' && !isValidSendItDifficulty(value)) return;
            const next = { ...getSendItSignalSelection(resortId), [key]: value };
            sendItSignalSelectionByResort[resortId] = next;
        }

        function getNextSendItGroup(selection) {
            return SENDIT_GROUP_ORDER.find((key) => !selection[key]) || '';
        }

        function canSubmitSendItSelection(selection) {
            if (!selection || !isValidSendItDifficulty(selection.difficulty)) return false;
            return SENDIT_GROUP_ORDER.every((key) => !!selection[key]);
        }

        function getSendItStepLabel(selection, activeGroup) {
            if (!selection || !isValidSendItDifficulty(selection.difficulty)) {
                return 'TRAIL';
            }
            if (canSubmitSendItSelection(selection)) {
                return 'SEND IT!';
            }
            return '';
        }

        function getSendItCooldownMinutesForResort(resortId) {
            const override = sendItCooldownOverrides?.[resortId];
            return Number.isFinite(Number(override)) ? Math.max(1, Number(override)) : sendItCooldownMinutes;
        }

        function getSendItCooldownRemainingMinutes(resortId) {
            const until = Number(sendItCooldownUntilByResort?.[resortId] || 0);
            if (!Number.isFinite(until) || until <= Date.now()) {
                if (sendItCooldownUntilByResort[resortId]) {
                    delete sendItCooldownUntilByResort[resortId];
                    persistSendItCooldownState();
                }
                return 0;
            }
            return Math.max(1, Math.ceil((until - Date.now()) / 60000));
        }

        function setSendItLocalCooldown(resortId, minutes) {
            const safeMinutes = Math.max(1, Math.round(Number(minutes) || getSendItCooldownMinutesForResort(resortId)));
            sendItCooldownUntilByResort[resortId] = Date.now() + (safeMinutes * 60 * 1000);
            sendItCooldownCtaByResort[resortId] = pickRandomLabel(SENDIT_COOLDOWN_CTA_OPTIONS);
            persistSendItCooldownState();
        }

        function clearSendItLocalCooldown(resortId) {
            if (sendItCooldownUntilByResort[resortId]) {
                delete sendItCooldownUntilByResort[resortId];
                persistSendItCooldownState();
            }
        }

        function getSendItCooldownCta(resortId) {
            if (!sendItCooldownCtaByResort[resortId]) {
                sendItCooldownCtaByResort[resortId] = pickRandomLabel(SENDIT_COOLDOWN_CTA_OPTIONS);
            }
            return sendItCooldownCtaByResort[resortId];
        }

        function getSendItDirectionText(canVote, radialReady, selection, activeGroup, isPostVoteAwait) {
            if (!canVote) return 'Tap center to verify on-mountain.';
            if (isPostVoteAwait) return '';
            if (radialReady) return 'Dialed in. SEND IT!';
            if (!selection || !selection.difficulty) return 'Choose your trail.';
            if (activeGroup === 'wind') return 'Is it windy?';
            if (activeGroup === 'crowd') return 'Is it crowded?';
            if (activeGroup === 'hazard') return 'Any hazards?';
            if (activeGroup === 'slope') return 'How’s the snow?';
            return 'Complete your selections.';
        }

        function getSendItScoreFromSelection(selection) {
            if (!selection || !isValidSendItDifficulty(selection.difficulty)) return 60;

            const rankMap = {
                wind: { nuking: 0, breezy: 1, calm: 2 },
                crowd: { swarm: 0, normal: 1, quiet: 2 },
                hazard: { icy: 0, swarm: 0, clear: 2 },
                slope: { edges: 0, good: 1, full: 2 }
            };

            const windRank = rankMap.wind[selection.wind] ?? 1;
            const crowdRank = rankMap.crowd[selection.crowd] ?? 1;
            const hazardRank = rankMap.hazard[selection.hazard] ?? 1;
            const snowRank = rankMap.slope[selection.slope] ?? 1;
            const avgRank = (windRank + crowdRank + hazardRank + snowRank) / 4;

            return Math.round(20 + avgRank * 40);
        }

        function polarPoint(cx, cy, r, aDeg) {
            const a = (aDeg * Math.PI) / 180;
            return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
        }

        function sectorPathData(cx, cy, rIn, rOut, aStart, aEnd) {
            const p1 = polarPoint(cx, cy, rOut, aStart);
            const p2 = polarPoint(cx, cy, rOut, aEnd);
            const p3 = polarPoint(cx, cy, rIn, aEnd);
            const p4 = polarPoint(cx, cy, rIn, aStart);
            const large = Math.abs(aEnd - aStart) > 180 ? 1 : 0;
            return [
                `M ${p1.x} ${p1.y}`,
                `A ${rOut} ${rOut} 0 ${large} 1 ${p2.x} ${p2.y}`,
                `L ${p3.x} ${p3.y}`,
                `A ${rIn} ${rIn} 0 ${large} 0 ${p4.x} ${p4.y}`,
                'Z'
            ].join(' ');
        }

        function buildSendItWheelMarkup(resortId, selectedSignals, activeGroup, canVote) {
            const difficultyCfg = [
                { key: 'green', glyph: '●', center: -150 },
                { key: 'blue', glyph: '■', center: -108 },
                { key: 'black', glyph: '◆', center: -66 },
                { key: 'double', glyph: '◆◆', center: -24 }
            ];

            const diffSectors = difficultyCfg.map((cfg, index) => {
                const active = selectedSignals.difficulty === cfg.key ? 'active' : '';
                const d = sectorPathData(300, 300, 106, 196, cfg.center - 20, cfg.center + 20);
                const lp = polarPoint(300, 300, (106 + 196) / 2, cfg.center);
                const rotation = cfg.center + 90;
                const glyph = cfg.key === 'double' ? '◆ ◆' : cfg.glyph;
                return `
                    <path class="wheel-sector signal-sector ${active}" d="${d}" data-diff-idx="${index + 1}" data-sendit-action="select-difficulty" data-resort-id="${resortId}" data-value="${cfg.key}"></path>
                    <text class="wheel-label signal-label ${active}" data-diff-idx="${index + 1}" data-sendit-action="select-difficulty" data-resort-id="${resortId}" data-value="${cfg.key}" x="${lp.x}" y="${lp.y}" transform="rotate(${rotation} ${lp.x} ${lp.y})">${glyph}</text>
                `;
            }).join('');

            const optionMap = {
                wind: SENDIT_WIND_OPTIONS,
                crowd: SENDIT_CROWD_OPTIONS,
                hazard: SENDIT_HAZARD_OPTIONS,
                slope: SENDIT_SLOPE_OPTIONS
            };
            const opts = optionMap[activeGroup] || [];
            const offsets = [-56, 0, 56];
            const showSecondary = !!selectedSignals.difficulty && !!activeGroup && opts.length > 0;
            const optionSectors = showSecondary ? opts.map((opt, i) => {
                const center = -90 + offsets[i];
                const d = sectorPathData(300, 300, 210, 292, center - 24, center + 24);
                const active = selectedSignals[activeGroup] === opt.key ? 'active' : '';
                const guideId = `sendit-guide-${resortId}-${activeGroup}-${i}`;
                const radius = (210 + 292) / 2;
                const start = center - 23;
                const end = center + 23;
                const a = polarPoint(300, 300, radius, start);
                const b = polarPoint(300, 300, radius, end);
                return `
                    <path class="wheel-sector option-sector ${active}" d="${d}" data-opt-idx="${i + 1}" data-sendit-action="select-option" data-resort-id="${resortId}" data-group="${activeGroup}" data-value="${opt.key}"></path>
                    <path id="${guideId}" class="label-guide" d="M ${a.x} ${a.y} A ${radius} ${radius} 0 0 1 ${b.x} ${b.y}"></path>
                    <text class="wheel-label option-label ${active}" data-opt-idx="${i + 1}" data-sendit-action="select-option" data-resort-id="${resortId}" data-group="${activeGroup}" data-value="${opt.key}">
                      <textPath href="#${guideId}" startOffset="50%" text-anchor="middle">${opt.label}</textPath>
                    </text>
                `;
            }).join('') : '';

            return `
                <div class="sendit-radial-rings">
                    <div class="ring ring-c"></div>
                </div>
                <svg class="sendit-hud-wheel ${canVote ? '' : 'locked'}" viewBox="0 0 600 600" aria-label="Slope Signal radial">
                    <g>${diffSectors}</g>
                    <g>${optionSectors}</g>
                </svg>
            `;
        }

        function getSendItOutOfRangeMessage(distanceMiles) {
            const template = pickRandomLabel(SENDIT_OUT_OF_RANGE_OPTIONS);
            return template
                .replace('{distance}', distanceMiles.toFixed(1));
        }

        function getSendItVerifySubtitleParts(resortId) {
            if (!sendItVerifyFlavorByResort[resortId]) {
                sendItVerifyFlavorByResort[resortId] = pickRandomLabel(SENDIT_VERIFY_TAGLINES);
            }
            return {
                primary: 'Verify once to unlock local voting.',
                secondary: sendItVerifyFlavorByResort[resortId]
            };
        }

        function loadSendItUnlockState() {
            try {
                const raw = localStorage.getItem('icecoast_sendit_unlocked');
                if (!raw) return;
                const ids = JSON.parse(raw);
                if (Array.isArray(ids)) {
                    const migratedIds = ids.filter(id => id !== 'blue-mountain' && id !== 'mont-sutton');
                    migratedIds.forEach(id => sendItUnlockedResorts.add(id));
                    if (migratedIds.length !== ids.length) {
                        localStorage.setItem('icecoast_sendit_unlocked', JSON.stringify(migratedIds));
                    }
                }
            } catch (e) {
                console.warn('Could not load Send It unlock state:', e);
            }
        }

        function persistSendItUnlockState() {
            try {
                localStorage.setItem(
                    'icecoast_sendit_unlocked',
                    JSON.stringify(Array.from(sendItUnlockedResorts))
                );
            } catch (e) {
                console.warn('Could not persist Send It unlock state:', e);
            }
        }

        function loadSendItCooldownState() {
            try {
                const raw = localStorage.getItem(SENDIT_COOLDOWN_STATE_KEY);
                if (!raw) return;
                const parsed = JSON.parse(raw);
                if (!parsed || typeof parsed !== 'object') return;
                const now = Date.now();
                const next = {};
                Object.entries(parsed).forEach(([resortId, until]) => {
                    const ts = Number(until);
                    if (Number.isFinite(ts) && ts > now) next[resortId] = ts;
                });
                sendItCooldownUntilByResort = next;
            } catch (e) {
                console.warn('Could not load Send It cooldown state:', e);
            }
        }

        function persistSendItCooldownState() {
            try {
                localStorage.setItem(SENDIT_COOLDOWN_STATE_KEY, JSON.stringify(sendItCooldownUntilByResort));
            } catch (e) {
                console.warn('Could not persist Send It cooldown state:', e);
            }
        }

        function applySendItTestUnlocks() {
            SENDIT_TEST_UNLOCKED_RESORTS.forEach((id) => sendItUnlockedResorts.add(id));
        }

        function getResortCoords(resortId) {
            const resort = (resorts || []).find(r => r.id === resortId);
            if (!resort) return null;
            if (typeof resort.lat !== 'number' || typeof resort.lon !== 'number') return null;
            return { lat: resort.lat, lon: resort.lon };
        }

        function getSendItRadiusMilesForResort(resortId) {
            const override = sendItRadiusOverrides?.[resortId];
            return typeof override === 'number' ? override : sendItRadiusMiles;
        }

        function formatMiles(miles) {
            return Number.isInteger(miles) ? `${miles}` : `${miles.toFixed(1)}`;
        }

        function getEasternNowParts() {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).formatToParts(new Date());
            const get = (type) => parts.find(p => p.type === type)?.value || '';
            return {
                weekday: get('weekday'),
                hour: Number(get('hour')),
                minute: Number(get('minute'))
            };
        }

        function getLiftCloseHourForResort(resortId, isWeekend) {
            const config = NIGHT_SKI_CLOSE_HOURS[resortId];
            if (config && Number.isFinite(Number(isWeekend ? config.weekend : config.weekday))) {
                return Number(isWeekend ? config.weekend : config.weekday);
            }
            return DEFAULT_LIFT_CLOSE_HOUR;
        }

        function isAfterLiftClose(resortId) {
            const now = getEasternNowParts();
            const isWeekend = now.weekday === 'Sat' || now.weekday === 'Sun';
            const closeHour = getLiftCloseHourForResort(resortId, isWeekend);
            const nowDecimal = (Number(now.hour) || 0) + ((Number(now.minute) || 0) / 60);
            return nowDecimal >= closeHour;
        }

        function formatSnapshotBadge(iso) {
            if (!iso) return 'Last Updated —';
            const dt = new Date(iso);
            if (Number.isNaN(dt.getTime())) return 'Last Updated —';
            const time = dt.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            });
            return `Last Updated ${time}`;
        }

        function formatUpdateLabel(iso, prefix) {
            if (!iso) return `${prefix} —`;
            const dt = new Date(iso);
            if (Number.isNaN(dt.getTime())) return `${prefix} —`;
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfTarget = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
            const dayDiff = Math.round((startOfToday - startOfTarget) / (24 * 60 * 60 * 1000));
            const time = dt.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            });
            if (dayDiff <= 0) return `${prefix} ${time}`;
            if (dayDiff === 1) return `${prefix} yesterday ${time}`;
            const dateLabel = dt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            return `${prefix} ${dateLabel}, ${time}`;
        }

        function isRecentIso(iso, maxHours = 24) {
            if (!iso) return false;
            const ts = Date.parse(iso);
            if (!Number.isFinite(ts)) return false;
            return (Date.now() - ts) <= (maxHours * 60 * 60 * 1000);
        }

        function getSendItDeviceId() {
            try {
                let id = localStorage.getItem(SENDIT_DEVICE_ID_KEY);
                if (id && typeof id === 'string' && id.length >= 8) {
                    return id;
                }
                if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                    id = window.crypto.randomUUID();
                } else {
                    id = `sid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
                }
                localStorage.setItem(SENDIT_DEVICE_ID_KEY, id);
                return id;
            } catch (e) {
                return null;
            }
        }

        function getSendItState(scoreValue, resortId) {
            if (!Number.isFinite(scoreValue)) {
                return { label: 'First Chair', className: '' };
            }
            if (scoreValue >= 70) {
                return { label: getSendItStateLabelForResort(resortId, 'high'), className: 'hot' };
            }
            if (scoreValue >= 45) {
                return { label: getSendItStateLabelForResort(resortId, 'mid'), className: 'mid' };
            }
            return { label: getSendItStateLabelForResort(resortId, 'low'), className: 'cold' };
        }

        function isUnlimitedSendItTestResort(resortId) {
            return SENDIT_TEST_UNLIMITED_RESORTS.has(resortId);
        }

        function isOnMountainSendItTestResort(resortId) {
            return SENDIT_TEST_ON_MOUNTAIN_RESORTS.has(resortId);
        }

        function isUnlockOnlySendItTestResort(resortId) {
            return SENDIT_TEST_UNLOCK_ONLY_RESORTS.has(resortId);
        }

        function getSendItSocialLine(votesLastHour, votesTotal) {
            if (votesLastHour > 0) {
                return `${votesLastHour} local${votesLastHour === 1 ? '' : 's'} voted in the last hour`;
            }
            if (votesTotal > 0) {
                return `No fresh votes in the last hour • ${votesTotal} total`;
            }
            return '';
        }

        function pickStableSlopeSignalPhrase(pool, seedText) {
            if (!Array.isArray(pool) || !pool.length) return 'First Chair';
            const seed = `${seedText || 'icecoast-signal'}`;
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
            }
            const idx = Math.abs(hash) % pool.length;
            return pool[idx];
        }

        function getSlopeSignalPayoffPhrase(resortId, scoreValue, votesTotal, crowdMode, windMode) {
            const votes = Number.isFinite(Number(votesTotal)) ? Number(votesTotal) : 0;
            const crowd = isValidSendItCrowd(crowdMode) ? crowdMode : SENDIT_DEFAULT_SIGNALS.crowd;
            const wind = isValidSendItWind(windMode) ? windMode : SENDIT_DEFAULT_SIGNALS.wind;

            if (!Number.isFinite(Number(scoreValue)) || votes < SENDIT_HISTORY_MIN_VOTES) {
                return pickStableSlopeSignalPhrase(
                    SENDIT_PAYOFF_PHRASES.nodata,
                    `${resortId}|nodata|${crowd}|${wind}|${votes}`
                );
            }

            const numericScore = Number(scoreValue);
            const bucket = numericScore >= 70 ? 'high' : (numericScore >= 45 ? 'mid' : 'low');
            const quantizedScore = Math.round(numericScore / 5);
            return pickStableSlopeSignalPhrase(
                SENDIT_PAYOFF_PHRASES[bucket],
                `${resortId}|${bucket}|${crowd}|${wind}|${quantizedScore}|${votes}`
            );
        }

        function getSlopeSignalContextLine(crowdMode, windMode, hazardMode) {
            const crowd = isValidSendItCrowd(crowdMode) ? crowdMode : SENDIT_DEFAULT_SIGNALS.crowd;
            const wind = isValidSendItWind(windMode) ? windMode : SENDIT_DEFAULT_SIGNALS.wind;
            const hazard = isValidSendItHazard(hazardMode) ? hazardMode : SENDIT_DEFAULT_SIGNALS.hazard;

            const windText = wind === 'nuking'
                ? 'High wind'
                : (wind === 'breezy' ? 'Breezy wind' : 'Calm wind');
            const crowdText = crowd === 'swarm'
                ? 'Crowded'
                : (crowd === 'normal' ? 'Normal crowd' : 'Quiet crowd');
            const jerryText = hazard === 'clear'
                ? 'No jerrys in sight'
                : (hazard === 'swarm' ? 'JERRY SWARM' : 'Icy hazards');

            return `${windText}. ${crowdText}. ${jerryText}.`;
        }

        function normalizeDifficultyKey(raw) {
            const v = String(raw || '').trim().toLowerCase();
            if (!v) return '';
            if (v === 'green' || v === 'green-circle' || v === 'greencircle') return 'green';
            if (v === 'blue' || v === 'blue-square' || v === 'bluesquare') return 'blue';
            if (v === 'black' || v === 'black-diamond' || v === 'blackdiamond') return 'black';
            if (v === 'double' || v === 'double-black' || v === 'doubleblack' || v === 'double-black-diamond' || v === 'doubleblackdiamond') return 'double';
            return '';
        }

        function getSlopeSignalDifficultyMix(sendIt) {
            const zero = { green: 0, blue: 0, black: 0, double: 0, total: 0 };
            if (!sendIt || typeof sendIt !== 'object') return zero;
            const candidates = [
                sendIt.difficultyMix,
                sendIt.difficultyCounts,
                sendIt.difficultyBreakdown,
                sendIt.trailMix,
                sendIt.lineMix
            ];

            let counts = null;
            for (const source of candidates) {
                if (!source || typeof source !== 'object') continue;
                const next = { green: 0, blue: 0, black: 0, double: 0 };
                let found = false;
                Object.entries(source).forEach(([k, v]) => {
                    const key = normalizeDifficultyKey(k);
                    const num = Number(v);
                    if (key && Number.isFinite(num) && num > 0) {
                        next[key] += num;
                        found = true;
                    }
                });
                if (found) {
                    counts = next;
                    break;
                }
            }
            if (!counts) return zero;
            const total = counts.green + counts.blue + counts.black + counts.double;
            if (!Number.isFinite(total) || total <= 0) return zero;
            return {
                green: counts.green,
                blue: counts.blue,
                black: counts.black,
                double: counts.double,
                greenPct: Math.round((counts.green / total) * 100),
                bluePct: Math.round((counts.blue / total) * 100),
                blackPct: Math.round((counts.black / total) * 100),
                doublePct: Math.round((counts.double / total) * 100),
                total
            };
        }

        function getSlopeSignal24hSummary(resort, score24h, votes24h, crowdMode, windMode) {
            const regionKey = resort?.region || 'default';
            const phraseBank = SENDIT_24H_SUMMARY_BY_REGION[regionKey] || SENDIT_24H_SUMMARY_BY_REGION.default;
            const votes = Number.isFinite(Number(votes24h)) ? Number(votes24h) : 0;

            if (!Number.isFinite(Number(score24h)) || votes < SENDIT_HISTORY_MIN_VOTES) {
                return pickStableSlopeSignalPhrase(
                    phraseBank.fallback || SENDIT_24H_SUMMARY_BY_REGION.default.fallback,
                    `${resort?.id || 'resort'}|24h|fallback|${votes}`
                );
            }

            const crowd = isValidSendItCrowd(crowdMode) ? crowdMode : SENDIT_DEFAULT_SIGNALS.crowd;
            const wind = isValidSendItWind(windMode) ? windMode : SENDIT_DEFAULT_SIGNALS.wind;
            const numericScore = Number(score24h);
            const tier = numericScore >= 70 ? 'high' : (numericScore >= 45 ? 'mid' : 'low');
            const pool = phraseBank[tier] || SENDIT_24H_SUMMARY_BY_REGION.default[tier];

            return pickStableSlopeSignalPhrase(
                pool,
                `${resort?.id || 'resort'}|24h|${tier}|${crowd}|${wind}|${Math.round(numericScore / 5)}|${votes}`
            );
        }

        function haversineMiles(lat1, lon1, lat2, lon2) {
            const toRad = (deg) => (deg * Math.PI) / 180;
            const R = 3958.8;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }

        function getBrowserLocation() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation not supported'));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 12000,
                    maximumAge: 60000
                });
            });
        }

        function triggerHaptic(pattern) {
            try {
                if (navigator && typeof navigator.vibrate === 'function') {
                    navigator.vibrate(pattern);
                }
            } catch (e) {
            }
        }

        function showSendItToast(message, subline = 'Local read updated') {
            const existing = document.querySelector('.sendit-toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = 'sendit-toast';
            toast.innerHTML = `
                <span class="sendit-toast-icon" aria-hidden="true">⚡</span>
                <span class="sendit-toast-copy">
                    <span class="sendit-toast-title">${message}</span>
                    <span class="sendit-toast-subline">${subline}</span>
                </span>
            `;
            document.body.appendChild(toast);

            requestAnimationFrame(() => toast.classList.add('visible'));
            setTimeout(() => {
                toast.classList.remove('visible');
                setTimeout(() => toast.remove(), 260);
            }, 1500);
        }

        async function unlockSendItForResort(resortId, buttonEl) {
            const resortCoords = getResortCoords(resortId);
            if (!resortCoords) {
                alert('This resort is missing coordinates, so Send It voting is unavailable.');
                return;
            }

            if (isUnlimitedSendItTestResort(resortId) || isUnlockOnlySendItTestResort(resortId)) {
                if (buttonEl) {
                    buttonEl.classList.add('unlocking-out');
                    await new Promise(resolve => setTimeout(resolve, 180));
                }
                sendItUnlockedResorts.add(resortId);
                persistSendItUnlockState();
                sendItUnlockTransitionByResort[resortId] = true;
                renderResorts();
                return;
            }

            const originalText = buttonEl ? buttonEl.textContent : '';
            if (buttonEl) {
                buttonEl.disabled = true;
                buttonEl.textContent = 'Checking location...';
            }
            triggerHaptic(8);

            try {
                const pos = await getBrowserLocation();
                const requiredMiles = getSendItRadiusMilesForResort(resortId);
                const distance = haversineMiles(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    resortCoords.lat,
                    resortCoords.lon
                );

                if (distance > requiredMiles) {
                    alert(getSendItOutOfRangeMessage(distance));
                    return;
                }

                sendItUnlockedResorts.add(resortId);
                persistSendItUnlockState();
                triggerHaptic([12, 24, 12]);
                if (buttonEl) {
                    buttonEl.classList.add('unlocking-out');
                    await new Promise(resolve => setTimeout(resolve, 180));
                }
                sendItUnlockTransitionByResort[resortId] = true;
                renderResorts();
            } catch (e) {
                alert('Could not verify your location. Please allow location access and try again.');
            } finally {
                if (buttonEl) {
                    buttonEl.disabled = false;
                    buttonEl.textContent = originalText;
                }
            }
        }

        async function submitSendItVote(resortId, score, signalSelection, buttonEl) {
            const resortCoords = getResortCoords(resortId);
            if (!resortCoords) {
                alert('This resort is missing coordinates, so Send It voting is unavailable.');
                return;
            }

            const localCooldownRemaining = getSendItCooldownRemainingMinutes(resortId);
            if (localCooldownRemaining > 0) {
                alert(getSendItCooldownMessage(localCooldownRemaining));
                return;
            }

            if (!Number.isFinite(score) || score < 0 || score > 100) {
                alert('Invalid Send It score.');
                return;
            }

            const originalText = buttonEl ? buttonEl.textContent : '';
            if (buttonEl) {
                buttonEl.disabled = true;
                buttonEl.classList.add('is-submitting');
                buttonEl.textContent = 'Submitting...';
            }
            triggerHaptic(10);

            try {
                const isUnlimitedTest = isUnlimitedSendItTestResort(resortId);
                const isOnMountainTest = isOnMountainSendItTestResort(resortId);
                let voteLat;
                let voteLon;
                let voteAccuracy;
                let deviceId = getSendItDeviceId();

                if (isUnlimitedTest || isOnMountainTest) {
                    voteLat = resortCoords.lat;
                    voteLon = resortCoords.lon;
                    voteAccuracy = 10;
                    if (isUnlimitedTest) {
                        deviceId = `test-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
                    }
                } else {
                    const pos = await getBrowserLocation();
                    voteLat = pos.coords.latitude;
                    voteLon = pos.coords.longitude;
                    voteAccuracy = pos.coords.accuracy;
                }

                const voteUrl = new URL('sendit/vote', WORKER_URL).toString();
                const resp = await fetch(voteUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        resortId,
                        score,
                        difficulty: signalSelection?.difficulty,
                        crowd: signalSelection?.crowd,
                        wind: signalSelection?.wind,
                        slope: signalSelection?.slope,
                        hazard: signalSelection?.hazard,
                        lat: voteLat,
                        lon: voteLon,
                        accuracy: voteAccuracy,
                        deviceId
                    })
                });

                const payload = await resp.json();
                if (!resp.ok) {
                    if (resp.status === 429 && Number.isFinite(payload?.retryAfterMinutes)) {
                        const cooldownError = new Error(payload?.error || 'Cooldown active');
                        cooldownError.code = 'SENDIT_COOLDOWN';
                        cooldownError.retryAfterMinutes = payload.retryAfterMinutes;
                        throw cooldownError;
                    }
                    throw new Error(payload?.error || `Vote failed (${resp.status})`);
                }

                if (payload?.summary) {
                    sendItSummaryByResort[resortId] = payload.summary;
                }
                if (typeof payload?.radiusMiles === 'number') {
                    sendItRadiusOverrides[resortId] = payload.radiusMiles;
                }

                triggerHaptic([14, 26, 14]);
                if (buttonEl) {
                    buttonEl.classList.remove('is-submitting');
                    buttonEl.classList.add('vote-success');
                    buttonEl.textContent = 'Locked In ⚡';
                }
                await new Promise(resolve => setTimeout(resolve, 320));

                await new Promise(resolve => setTimeout(resolve, 280));
                showSendItToast('Slope Signal SENT');
                triggerHaptic([18, 28, 16, 36, 22]);
                setSendItLocalCooldown(resortId, payload?.cooldownMinutes);
                sendItPostVoteAwaitByResort[resortId] = true;
                sendItReadySlamByResort[resortId] = false;
                renderResorts();
            } catch (e) {
                triggerHaptic([24, 34, 24]);
                if (e?.code === 'SENDIT_COOLDOWN') {
                    setSendItLocalCooldown(resortId, e.retryAfterMinutes);
                    sendItPostVoteAwaitByResort[resortId] = true;
                    renderResorts();
                    alert(getSendItCooldownMessage(e.retryAfterMinutes));
                    return;
                }
                alert(e.message || 'Unable to submit vote right now.');
            } finally {
                if (buttonEl && buttonEl.isConnected) {
                    buttonEl.disabled = false;
                    buttonEl.classList.remove('is-submitting');
                    buttonEl.textContent = originalText;
                }
            }
        }

        function createResortCard(resort) {
            const vertical = resort.elevation?.vertical ?? '—';
            const trailsOpen = resort.trails?.open ?? '—';
            const trailsClosed = resort.trails?.closed ?? '—';
            const liftsOpen = resort.lifts?.open ?? '—';
            const liftsClosed = resort.lifts?.closed ?? '—';

            const park = resort.park ?? 0;
            const glades = resort.glades ?? 0;
            const apres = resort.apres ?? 0;
            const family = resort.family ?? 0;
            const apresScore = Math.max(0, Math.min(5, Math.round(Number(apres) || 0)));
            const familyScore = Math.max(0, Math.min(5, Math.round(Number(family) || 0)));

            const passes = resort.passes || [];
            const distance = resort.distance || {};
            const distanceEntries = Object.entries(distance)
                .sort(([, aTime], [, bTime]) => parseDriveTimeMinutes(aTime) - parseDriveTimeMinutes(bTime));
            const etaState = etaStateByResort[resort.id] || null;
            const etaButtonDisabled = !!(etaState && (etaState.status === 'loading' || etaState.status === 'disabled'));
            const etaButtonLabel = etaState?.status === 'loading'
                ? 'Getting ETA…'
                : (etaState?.status === 'ok' ? 'Refresh ETA' : 'Get ETA');
            const etaValue = etaState?.status === 'ok' && etaState?.etaLabel ? etaState.etaLabel : '—';
            const etaSubline = (etaState && (etaState.status === 'error' || etaState.status === 'disabled') && etaState.message)
                ? etaState.message
                : '';
            const weather = resort.weather || {};
            const forecast = resort.forecast || [];

            const stars = Array.from({ length: 5 }, (_, i) => {
                const isFilled = i < (resort.rating || 0);
                return `<span class="star ${isFilled ? 'filled' : 'empty'}">★</span>`;
            }).join('');

            const sendIt = sendItSummaryByResort[resort.id] || {};
            const showLiftMoon = isAfterLiftClose(resort.id);
            const hasFreshPatrol = !!resort.hasPatrolUpdate && !!resort.patrolUpdatedAt;
            const sendItButtonCopy = getSendItButtonCopy(resort.id);
            const sendItVotes = Number.isFinite(sendIt.votes) ? sendIt.votes : 0;
            const sendItScoreValue = Number.isFinite(sendIt.score) ? sendIt.score : null;
            const sendItTone = (!Number.isFinite(sendItScoreValue) || sendItVotes < SENDIT_HISTORY_MIN_VOTES)
                ? 'mid'
                : (sendItScoreValue >= 70 ? 'high' : (sendItScoreValue >= 45 ? 'mid' : 'low'));
            const hasCoords = typeof resort.lat === 'number' && typeof resort.lon === 'number';
            const canVote = hasCoords && sendItUnlockedResorts.has(resort.id);
            const cooldownRemainingMinutes = getSendItCooldownRemainingMinutes(resort.id);
            const isCooldownActive = canVote && cooldownRemainingMinutes > 0;
            const isPostVoteAwait = canVote && !!sendItPostVoteAwaitByResort[resort.id];
            const selectedSignals = getSendItSignalSelection(resort.id);
            const liveCrowdMode = isValidSendItCrowd(sendIt.crowdMode) ? sendIt.crowdMode : null;
            const liveWindMode = isValidSendItWind(sendIt.windMode) ? sendIt.windMode : null;
            const liveHazardMode = isValidSendItHazard(sendIt.hazardMode) ? sendIt.hazardMode : null;
            const sendItVotes24h = Number.isFinite(sendIt.votes24h) ? Number(sendIt.votes24h) : 0;
            const sendItScore24h = Number.isFinite(sendIt.score24h)
                ? sendIt.score24h
                : (Number.isFinite(sendIt.score) && sendItVotes24h > 0 ? Number(sendIt.score) : null);
            const sendItSummary24h = getSlopeSignal24hSummary(
                resort,
                sendItScore24h,
                sendItVotes24h,
                liveCrowdMode,
                liveWindMode
            );
            const sendItSubtitlePrimary = getSlopeSignalPayoffPhrase(
                resort.id,
                sendItScoreValue,
                sendItVotes,
                liveCrowdMode,
                liveWindMode
            );
            const sendItSubtitleSecondary = getSlopeSignalContextLine(liveCrowdMode, liveWindMode, liveHazardMode);
            const sendItPrompt = '';
            const difficultyMix = getSlopeSignalDifficultyMix(sendIt);
            const hasDifficultyMix = difficultyMix.total >= SENDIT_HISTORY_MIN_VOTES;
            const difficultyMixMarkup = `<div class="sendit-line-mix" aria-label="Slope Signal line mix">
                     <span class="mix-pill mix-green" title="Green Circle calls"><span class="mix-glyph">●</span><span class="mix-value">${Math.round(difficultyMix.green)} calls</span></span>
                     <span class="mix-pill mix-blue" title="Blue Square calls"><span class="mix-glyph">■</span><span class="mix-value">${Math.round(difficultyMix.blue)} calls</span></span>
                     <span class="mix-pill mix-black" title="Black Diamond calls"><span class="mix-glyph">◆</span><span class="mix-value">${Math.round(difficultyMix.black)} calls</span></span>
                     <span class="mix-pill mix-double" title="Double Black Diamond calls"><span class="mix-glyph">◆◆</span><span class="mix-value">${Math.round(difficultyMix.double)} calls</span></span>
                   </div>
                   ${hasDifficultyMix ? '' : '<div class="sendit-line-mix-note">First chair takes the lead.</div>'}`;
            const nextGroup = getNextSendItGroup(selectedSignals) || '';
            const selectionComplete = canSubmitSendItSelection(selectedSignals);
            const activeGroup = selectionComplete
                ? ''
                : (SENDIT_GROUP_ORDER.includes(selectedSignals.activeGroup)
                    ? selectedSignals.activeGroup
                    : nextGroup);
            const groupOptionsMap = {
                wind: SENDIT_WIND_OPTIONS,
                crowd: SENDIT_CROWD_OPTIONS,
                hazard: SENDIT_HAZARD_OPTIONS,
                slope: SENDIT_SLOPE_OPTIONS
            };
            const radialOptions = groupOptionsMap[activeGroup] || [];
            const radialReady = canSubmitSendItSelection(selectedSignals);
            const selectedDifficultyTitle = SENDIT_DIFFICULTY_OPTIONS.find((opt) => opt.key === selectedSignals.difficulty)?.title || '';
            const showSecondary = !!selectedSignals.difficulty;
            const selectedGroups = SENDIT_GROUP_ORDER.filter((key) => !!selectedSignals[key]);
            const locklineVisible = (!isPostVoteAwait && selectedSignals.difficulty && selectedGroups.length > 0) ? 'visible' : '';
            const doFinalSlam = !!sendItReadySlamByResort[resort.id];
            const locklineModeClass = doFinalSlam ? 'final-slam' : (locklineVisible ? 'soft' : '');
            if (doFinalSlam) {
                sendItReadySlamByResort[resort.id] = false;
            }
            const locklineMarkup = selectedGroups.map((group, idx) => `
                <span class="lock-item"><img src="${SENDIT_GROUP_ICON_PATHS[group]}" alt="${group} locked"></span>
                ${idx < selectedGroups.length - 1 ? '<span class="lock-plus">+</span>' : ''}
            `).join('');
            const centerIcon = canVote && !isPostVoteAwait && !isCooldownActive && selectedSignals.difficulty && !radialReady && activeGroup
                ? `<img class="send-core-icon send-core-icon-stage ${activeGroup === 'hazard' ? 'icon-hazard' : ''}" src="${SENDIT_GROUP_ICON_PATHS[activeGroup]}" alt="${activeGroup} icon">`
                : '';
            const centerLabel = canVote
                ? (isPostVoteAwait ? `<span class="line-stack">${getSendItCooldownCta(resort.id)}</span>` : getSendItStepLabel(selectedSignals, activeGroup))
                : '<span class="line-stack">I\'M HERE!</span>';
            const radialWheelMarkup = isPostVoteAwait
                ? ''
                : buildSendItWheelMarkup(resort.id, selectedSignals, activeGroup, canVote);
            const radialEnterClass = sendItUnlockTransitionByResort[resort.id] ? 'unlock-enter' : '';
            if (sendItUnlockTransitionByResort[resort.id]) {
                sendItUnlockTransitionByResort[resort.id] = false;
            }
            const radialDirectionText = getSendItDirectionText(
                canVote,
                radialReady,
                selectedSignals,
                activeGroup,
                isPostVoteAwait
            );
            const radialPulseClass = !canVote || isCooldownActive || isPostVoteAwait
                ? ''
                : (!selectedSignals.difficulty
                    ? 'pulse-difficulty'
                    : (!radialReady ? 'pulse-secondary' : ''));
            const sendItControls = !hasCoords ? `<div class="sendit-locked-note">Coordinates missing for this resort.</div>` : `<div class="sendit-radial ${radialEnterClass}" data-resort-id="${resort.id}">
                      <div class="sendit-hud-radial unlocked ${radialPulseClass}">
                        ${radialWheelMarkup}
                        <button
                          class="sendit-core-btn ${radialReady && !isCooldownActive && !isPostVoteAwait ? 'ready' : ''} ${(isCooldownActive || isPostVoteAwait) ? 'cooldown' : ''}"
                          data-sendit-action="${canVote ? (isPostVoteAwait ? 'restart-signal' : 'vote-radial') : 'unlock'}"
                          data-resort-id="${resort.id}"
                          ${(canVote && !isPostVoteAwait && !radialReady) ? 'disabled' : ''}
                          type="button">${centerIcon}<span class="send-core-label">${centerLabel}</span></button>
                        <div class="selection-lockline ${canVote ? locklineVisible : ''} ${canVote ? locklineModeClass : ''}">${canVote ? locklineMarkup : ''}</div>
                        <div class="sendit-radial-direction">${radialDirectionText}</div>
                      </div>
                    </div>`;

            const heroChips = [];
            if (glades > 0) {
                heroChips.push({
                    cls: 'chip-glades',
                    label: glades >= 3 ? 'Elite Glades' : (glades === 2 ? 'Excellent Glades' : 'Some Glades')
                });
            } else if (resort.familyOwned) {
                heroChips.push({
                    cls: 'chip-family',
                    label: 'Family-Owned'
                });
            }
            const hasSignificantSnow = parseInt(resort.snowfall24h || '0', 10) >= 6;
            if (hasSignificantSnow) {
                heroChips.push({
                    cls: 'chip-pow',
                    label: `${resort.snowfall24h || 0}″ Fresh Pow`
                });
            }
            const heroChipMarkup = heroChips.slice(0, 3)
                .map((chip) => `<span class="status-chip ${chip.cls}">${chip.label}</span>`)
                .join('');

            let confidenceLevel = 'Basic';
            if (hasFreshPatrol) {
                const updatedTs = Date.parse(resort.patrolUpdatedAt);
                if (Number.isFinite(updatedTs)) {
                    const hoursOld = (Date.now() - updatedTs) / (60 * 60 * 1000);
                    if (hoursOld <= 24) {
                        confidenceLevel = 'High';
                    } else if (hoursOld <= 48) {
                        confidenceLevel = 'Medium';
                    } else {
                        confidenceLevel = 'Basic';
                    }
                }
            }
            const confidenceClass = confidenceLevel === 'High' ? 'confidence-high' : (confidenceLevel === 'Medium' ? 'confidence-mid' : 'confidence-low');
            const metrics24h = parseInt(resort.snowfall24h || 0, 10);
            const metrics48h = parseInt(resort.snowfall48h || 0, 10);
            const metricsTemp = weather.tempF ?? (typeof weather.temp === 'number' ? `${weather.temp}°` : '—');
            const feelsLikeValue = typeof weather.feelsLike === 'number'
                ? weather.feelsLike
                : (typeof weather.feelsLikeF === 'string' ? parseFloat(weather.feelsLikeF) : null);
            const metricsFeelsLikeBase = weather.feelsLikeF ?? (typeof weather.feelsLike === 'number' ? `${weather.feelsLike}°` : '—');
            const metricsWindBase = weather.wind ?? '—';
            const signalLead = sendItSubtitlePrimary;
            const powWatch = resort.powWatch || null;
            const toSnowTotal = (arr) => Number((Array.isArray(arr) ? arr : []).reduce((sum, v) => sum + (Number(v) || 0), 0).toFixed(1));
            const powWatchNwsHours = Number(powWatch?.hourlySourceMix?.nws || 0);
            const mergedHourly24 = toSnowTotal(powWatch?.hourly?.snowSeries24);
            const mergedHourly48 = toSnowTotal(powWatch?.hourly?.snowSeries48);
            const mergedHourly72 = toSnowTotal(powWatch?.hourly?.snowSeries72);
            const useMergedHourlyTotals = Boolean(powWatch?.nwsAvailable) && powWatchNwsHours >= 12 && mergedHourly72 > 0;
            const powWatch24 = useMergedHourlyTotals
                ? `${mergedHourly24.toFixed(1)}`
                : (Number.isFinite(Number(powWatch?.totals?.snow24))
                    ? `${Number(powWatch.totals.snow24).toFixed(1)}`
                    : '0.0');
            const powWatch48 = useMergedHourlyTotals
                ? `${mergedHourly48.toFixed(1)}`
                : (Number.isFinite(Number(powWatch?.totals?.snow48))
                    ? `${Number(powWatch.totals.snow48).toFixed(1)}`
                    : '0.0');
            const powWatch72 = useMergedHourlyTotals
                ? `${mergedHourly72.toFixed(1)}`
                : (Number.isFinite(Number(powWatch?.totals?.snow72))
                    ? `${Number(powWatch.totals.snow72).toFixed(1)}`
                    : '0.0');
            const powWatchModelSpread72 = Number.isFinite(Number(powWatch?.modelSpread72))
                ? Number(powWatch.modelSpread72)
                : null;
            const powWatchBandRaw = getPowWatchBandForResort(resort);
            const powWatchStatusLabelRaw = String(powWatch?.statusLabel || '').toUpperCase() || (powWatchBandRaw === 'POW WATCH ON'
                ? 'ON'
                : (powWatchBandRaw === 'POW WATCH BUILDING' ? 'BUILDING' : 'QUIET'));
            const powWatchStatusLabel = powWatchStatusLabelRaw === 'ON' ? 'ACTIVE' : powWatchStatusLabelRaw;
            const powWatchBadgeClass = (
                powWatchStatusLabel === 'STORM' ? 'pow-watch-storm'
                : (powWatchStatusLabel === 'ACTIVE' ? 'pow-watch-active'
                : (powWatchStatusLabel === 'WINDY' ? 'pow-watch-windy'
                : (powWatchStatusLabel === 'INCOMING' ? 'pow-watch-incoming'
                : (powWatchStatusLabel === 'ON' ? 'pow-watch-on'
                : (powWatchStatusLabel === 'BUILDING' ? 'pow-watch-building' : 'pow-watch-quiet')))))
            );
            const powAlert = powWatch?.alert || null;
            const hasPowAlert = Boolean(powAlert?.active && powAlert?.event);
            const alertExpiryMs = Date.parse(String(powAlert?.expires || ''));
            const alertExpiryLabel = Number.isFinite(alertExpiryMs)
                ? new Date(alertExpiryMs).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
                : 'later';
            const powAlertBanner = hasPowAlert
                ? `❄️ ${powAlert.event} in effect through ${alertExpiryLabel}`
                : '';
            const snowLevelCurrent = Number.isFinite(Number(powWatch?.snowLevel?.current))
                ? Math.round(Number(powWatch.snowLevel.current))
                : null;
            const snowLevelTrendRaw = String(powWatch?.snowLevel?.trend || '').toLowerCase();
            const snowLevelTrendSymbol = snowLevelTrendRaw === 'falling'
                ? '↓'
                : (snowLevelTrendRaw === 'rising' ? '↑' : '→');
            const snowLevelLine = snowLevelCurrent !== null
                ? (powWatch?.snowLevel?.rainPossibleAtBase
                    ? `Snow Level: ~${snowLevelCurrent.toLocaleString()} ft — rain possible at base`
                    : `Snow Level: ~${snowLevelCurrent.toLocaleString()} ft ${snowLevelTrendSymbol} ${snowLevelTrendRaw || 'steady'}`)
                : '';
            const isManualPowWatch = String(powWatch?.source || '').toLowerCase() === 'manual';
            const powWatchManualLabel = isManualPowWatch
                ? `<span class="pow-watch-manual-label" title="${String(powWatch?.overrideNote || 'Human-reviewed snowfall adjustment').replace(/"/g, '&quot;')}">Manually verified</span>`
                : '';
            const windHoldRiskLevelRaw = String(powWatch?.windHoldRisk?.level || 'LOW').toUpperCase();
            const windHoldRiskLabel = windHoldRiskLevelRaw === 'HIGH'
                ? 'HIGH'
                : (windHoldRiskLevelRaw === 'MODERATE' ? 'MODERATE' : 'LOW');
            const windHoldGust = Number.isFinite(Number(powWatch?.windHoldRisk?.maxGustMph))
                ? Math.round(Number(powWatch.windHoldRisk.maxGustMph))
                : null;
            const feelsLikeWarning = Number.isFinite(feelsLikeValue) && feelsLikeValue <= -10
                ? ` <button class="metric-warning-btn" type="button" aria-label="Cold warning" data-tip="Extreme cold can bite fast. Cover skin and check exposed lifts.">⚠︎</button>`
                : '';
            const windNowMatch = String(metricsWindBase || '').match(/-?\d+(\.\d+)?/);
            const windGustNowMatch = String(weather.windGust || '').match(/-?\d+(\.\d+)?/);
            const windNowMph = windNowMatch ? Number(windNowMatch[0]) : null;
            const windGustNowMph = windGustNowMatch ? Number(windGustNowMatch[0]) : null;
            const isCurrentWindWarning = (Number.isFinite(windNowMph) && windNowMph >= 20)
                || (Number.isFinite(windGustNowMph) && windGustNowMph >= 30);
            const windWarningTip = Number.isFinite(windGustNowMph)
                ? `Current wind ${Math.round(windNowMph || 0)} mph, gusts ${Math.round(windGustNowMph)} mph. Expect variable lift operations.`
                : `Current wind ${Math.round(windNowMph || 0)} mph. Exposure can ramp quickly at summit.`;
            const windRiskWarning = isCurrentWindWarning
                ? ` <button class="metric-warning-btn" type="button" aria-label="Wind warning" data-tip="${windWarningTip}">⚠︎</button>`
                : '';
            const metricsFeelsLike = `${metricsFeelsLikeBase}${feelsLikeWarning}`;
            const metricsWind = `${metricsWindBase}${windRiskWarning}`;
            const powBriefText = typeof powWatch?.powBrief === 'string' ? powWatch.powBrief.trim() : '';
            const nwsAlertEvent = String(powWatch?.alert?.event || '').trim();
            const fallbackBlipParts = [];
            if (nwsAlertEvent) fallbackBlipParts.push(`${nwsAlertEvent} active.`);
            if (snowLevelLine) fallbackBlipParts.push(String(snowLevelLine).replace(/^Snow Level:\s*/i, ''));
            if (windHoldRiskLevelRaw === 'HIGH') fallbackBlipParts.push('Wind hold risk is elevated this cycle.');
            const fallbackPowBrief = fallbackBlipParts.join(' ');
            const displayPowBrief = powBriefText || fallbackPowBrief;
            const hasPowBrief = displayPowBrief.length > 0;
            const powDays = Array.isArray(powWatch?.days) ? powWatch.days : [];
            const snowSeries72 = Array.isArray(powWatch?.hourly?.snowSeries72)
                ? powWatch.hourly.snowSeries72.map((v) => Number(v)).filter((v) => Number.isFinite(v))
                : [];
            const compactSeries = snowSeries72.length
                ? snowSeries72.filter((_, idx) => idx % 3 === 0).slice(0, 24)
                : [];
            const fallbackSegments = compactSeries.length
                ? []
                : [
                    Number(powWatch24),
                    Math.max(0, Number(powWatch48) - Number(powWatch24)),
                    Math.max(0, Number(powWatch72) - Number(powWatch48)),
                ];
            const chartSource = compactSeries.length ? compactSeries : fallbackSegments;
            const maxSeriesVal = chartSource.length ? Math.max(...chartSource, 0.1) : 0.1;
            const chartMaxLabel = `${maxSeriesVal.toFixed(1)}"`;
            const chartMidLabel = `${(maxSeriesVal / 2).toFixed(1)}"`;
            const chartBars = chartSource.length
                ? chartSource.map((v) => {
                    const h = Math.max(6, Math.round((Math.max(0, v) / maxSeriesVal) * 34));
                    return `<span class="pow-chart-bar" style="height:${h}px"></span>`;
                }).join('')
                : '<span class="pow-chart-empty">No measurable hourly snow in current model run.</span>';
            const peakTsMs = Date.parse(String(powWatch?.hourly?.peakTs || ''));
            const peakLabel = Number.isFinite(peakTsMs)
                ? (() => {
                    const peakDt = new Date(peakTsMs);
                    const nowDt = new Date();
                    const dayDiff = Math.floor((new Date(peakDt.getFullYear(), peakDt.getMonth(), peakDt.getDate()) - new Date(nowDt.getFullYear(), nowDt.getMonth(), nowDt.getDate())) / 86400000);
                    const dayLabel = dayDiff === 0
                        ? 'Today'
                        : (dayDiff === 1 ? 'Tomorrow' : peakDt.toLocaleDateString('en-US', { weekday: 'short' }));
                    const hourLabel = peakDt.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                    return `${dayLabel} ${hourLabel}`;
                })()
                : (powDays[0]?.date
                    ? `${new Date(`${powDays[0].date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })} daytime`
                    : 'No strong snow pulse yet');
            const peakSnowPerHour = Number.isFinite(Number(powWatch?.hourly?.peakSnowPerHour))
                ? Number(powWatch.hourly.peakSnowPerHour).toFixed(2)
                : Number(powWatch24).toFixed(1);
            const chartLegend = compactSeries.length
                ? 'Taller bars = heavier forecast snowfall.'
                : 'Taller bars = heavier forecast snowfall (daily trend view).';
            const pow24Num = Number(powWatch24) || 0;
            const pow72Num = Number(powWatch72) || 0;
            const rangeHalf = powWatchModelSpread72 !== null ? (powWatchModelSpread72 / 2) : 0;
            const potentialLow = Math.max(0, pow72Num - rangeHalf);
            const potentialHigh = Math.max(potentialLow, pow72Num + rangeHalf);
            const potentialRangeLabel = `${potentialLow.toFixed(1)}–${potentialHigh.toFixed(1)}"`;

const backgroundImageByResort = {
    'camelback': 'camelback.jpg',
    'cannon': 'cannon.jpg?v=20260208ab',
    'catamount': 'jiminy-peak.jpg',
    'berkshire-east': 'jiminy-peak.jpg',
    'bolton-valley': 'burke.jpg',
    'plattekill': 'belleayre.jpg',
    'black-mountain': 'wildcat.jpg',
    'magic-mountain': 'mad-river-glen.jpg',
    'ragged-mountain': 'waterville.jpg',
    'sunapee': 'waterville.jpg',
    'pats-peak': 'wachusett.jpg'
};
const backgroundLegacyFile = backgroundImageByResort[resort.id] || `${resort.id}.jpg`;
const backgroundLegacyBase = String(backgroundLegacyFile).replace(/\?.*$/, '');
const backgroundStem = backgroundLegacyBase.replace(/\.(png|jpe?g|webp)$/i, '');
const backgroundVar = `url('new-resort-art/${backgroundStem}.jpg'), url('new-resort-art/${backgroundStem}.png'), url('resort-art/${backgroundLegacyFile}')`;

const backgroundPositionByResort = {
    'camelback': 'center 30%',
    'blue-mountain': 'center 36%',
    'jack-frost': 'center 53%',
    'shawnee': 'center 38%',
    'bear-creek': 'center 42%',
    'elk': 'center 28%',
    'big-boulder': 'center 53%',
    'montage': 'center 46%',
    'hunter': 'center 33%',
    'windham': 'center 30%',
    'belleayre': 'center 40%',
    'plattekill': 'center 37%',
    'whiteface': 'center 23%',
    'gore-mountain': 'center 28%',
    'jiminy-peak': 'center 43%',
    'wachusett': 'center 41%',
    'catamount': 'center 41%',
    'berkshire-east': 'center 37%',
    'mohawk': 'center 55%',
    'stratton': 'center 40%',
    'mount-snow': 'center 34%',
    'killington': 'center 32%',
    'okemo': 'center 40%',
    'pico': 'center 31%',
    'sugarbush': 'center 26%',
    'mad-river-glen': 'center 24%',
    'stowe': 'center 27%',
    'smugglers-notch': 'center 31%',
    'jay-peak': 'center 27%',
    'burke': 'center 24%',
    'bolton-valley': 'center 27%',
    'loon': 'center 40%',
    'brettonwoods': 'center 27%',
    'waterville': 'center 34%',
    'cannon': 'center 24%',
    'wildcat': 'center 30%',
    'black-mountain': 'center 31%',
    'magic-mountain': 'center 29%',
    'ragged-mountain': 'center 36%',
    'sunapee': 'center 35%',
    'pats-peak': 'center 43%',
    'sunday-river': 'center 38%',
    'sugarloaf': 'center 48%',
    'saddleback': 'center 27%',
    'tremblant': 'center 29%',
    'mont-sainte-anne': 'center 37%',
    'le-massif': 'center 26%',
    'mont-sutton': 'center 31%'
};

            const backgroundPos = backgroundPositionByResort[resort.id] || 'center 42%';
            const backgroundSize = 'cover';
            const isFavorite = isFavoriteResort(resort.id);

            return `
            <div class="resort-card" id="resort-${resort.id}" data-region="${resort.region}" data-resort="${resort.id}">
              <div class="resort-header" style="--bg: ${backgroundVar}; --bg-pos: ${backgroundPos}; --bg-size: ${backgroundSize};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;width:100%;">
                  <div style="flex:1;padding-right:5.8rem;">
                    <h2 class="resort-name">
                      <span class="resort-name-text">${resort.name}</span>
                    </h2>
                    <p class="resort-location">${resort.location}</p>
                  </div>
                  <div class="resort-header-actions">
                    <button class="resort-btn resort-favorite-btn bm-btn ${isFavorite ? 'active' : ''}" data-favorite-resort="${resort.id}" type="button" aria-label="${isFavorite ? 'Remove' : 'Add'} ${resort.name} ${isFavorite ? 'from' : 'to'} favorites" aria-pressed="${isFavorite ? 'true' : 'false'}">
                      <span class="bm-ripple" aria-hidden="true"></span>
                      <svg class="bm-svg" viewBox="0 0 14 18" role="presentation" focusable="false" aria-hidden="true">
                        <path class="bm-fill" d="M 1 1 L 13 1 L 13 17 L 7 13 L 1 17 Z"></path>
                        <path class="bm-outline" d="M 1 1 L 13 1 L 13 17 L 7 13 L 1 17 Z"></path>
                      </svg>
                    </button>
                    <button class="resort-btn resort-share-btn sh-btn" data-share-resort="${resort.id}" type="button" aria-label="Share ${resort.name}">
                      <span class="sh-wrap" aria-hidden="true">
                        <span class="sh-mini sh-mini-1">
                          <svg viewBox="0 0 5 6"><path d="M2.5 0 L4.5 2.5 M2.5 0 L0.5 2.5 M2.5 0 L2.5 6"></path></svg>
                        </span>
                        <span class="sh-mini sh-mini-2">
                          <svg viewBox="0 0 5 6"><path d="M2.5 0 L4.5 2.5 M2.5 0 L0.5 2.5 M2.5 0 L2.5 6"></path></svg>
                        </span>
                        <span class="sh-mini sh-mini-3">
                          <svg viewBox="0 0 5 6"><path d="M2.5 0 L4.5 2.5 M2.5 0 L0.5 2.5 M2.5 0 L2.5 6"></path></svg>
                        </span>
                        <svg class="sh-svg" viewBox="0 0 14 17" focusable="false">
                          <g class="sh-arrow">
                            <path class="sh-outline" d="M 7 1 L 11 5 M 7 1 L 3 5 M 7 1 L 7 11"></path>
                          </g>
                          <g class="sh-box">
                            <path class="sh-outline" d="M 1 9 L 1 16 L 13 16 L 13 9"></path>
                          </g>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
                ${heroChipMarkup ? `<div class="status-chips status-chips-bottom">${heroChipMarkup}</div>` : ''}
              </div>

              <div class="resort-body">
                <div class="resort-unified-panel">
                <div class="conditions-highlight">
                  <div class="conditions-top">
                    <div class="conditions-label">Current Conditions</div>
                    <div class="conditions-confidence ${confidenceClass}">Confidence: ${confidenceLevel}</div>
                  </div>
                  <div class="conditions-value">${resort.conditions || 'Unknown'}</div>
                  <div class="conditions-metrics">
                    <span>24h Snow <strong>${metrics24h}"</strong></span>
                    <span>48h Snow <strong>${metrics48h}"</strong></span>
                  </div>
                  <div class="conditions-secondary-metrics">
                    <span class="metric-temp">Temp <strong>${metricsTemp}</strong></span>
                    <span>Feels Like <strong>${metricsFeelsLike}</strong></span>
                    <span>Wind <strong>${metricsWind}</strong></span>
                  </div>
                  ${hasPowBrief ? `<div class="conditions-nws-brief"><strong>NWS Brief:</strong> ${displayPowBrief}</div>` : ''}
                  <details class="forecast-inline">
                    <summary class="forecast-inline-toggle">
                      <span class="forecast-inline-left">
                        <span class="info-icon" style="display:inline-flex;vertical-align:middle;margin-right:0.4rem;">
                          ${icons.calendar}
                        </span>
                        3-Day Forecast
                      </span>
                      <span class="forecast-inline-chevron" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </summary>
                    <div class="forecast-grid">
                      ${forecast.map(day => `
                        <div class="forecast-day">
                          <div class="forecast-day-name">${day.day}</div>
                          <div class="forecast-icon">${day.icon}</div>
                          <div class="forecast-temp">${day.tempF ?? (typeof day.temp === 'number' ? `${day.temp}°` : '—')}</div>
                        </div>
                      `).join('')}
                    </div>
                  </details>
                  <div class="pow-watch-inline">
                    ${hasPowAlert ? `<div class="pow-watch-alert-banner">${powAlertBanner}</div>` : ''}
                    <div class="pow-watch-top">
                      <div class="pow-watch-head">POW WATCH</div>
                      <div class="pow-watch-badge ${powWatchBadgeClass}">${powWatchStatusLabel}</div>
                    </div>
                    <div class="pow-watch-sub">Next 72h snow potential</div>
                    <div class="pow-watch-metrics">
                      <span>24h <strong>${powWatch24}"</strong></span>
                      <span>48h <strong>${powWatch48}"</strong></span>
                      <span>72h <strong>${powWatch72}"</strong></span>
                      ${powWatchManualLabel}
                    </div>
                    ${snowLevelLine ? `<div class="pow-watch-snow-level">${snowLevelLine}</div>` : ''}
                    <div class="pow-watch-potential">Storm Total Potential: <strong>${potentialRangeLabel}</strong></div>
                    <details class="pow-watch-details">
                      <summary class="pow-watch-details-toggle">
                        <span>72h Snow Timeline</span>
                        <span class="pow-watch-details-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </summary>
                      <div class="pow-watch-window-grid">
                        <div class="pow-watch-window-labels">
                          <span>Most Active Snow Time</span>
                          <span>${peakLabel}</span>
                        </div>
                        <div class="pow-watch-window-labels">
                          <span>Peak Rate</span>
                          <span>${peakSnowPerHour}" / hr</span>
                        </div>
                        <div class="pow-watch-window-labels">
                          <span>Max Gust</span>
                          <span>${windHoldGust !== null ? `${windHoldGust} mph` : '—'}</span>
                        </div>
                        <div class="pow-watch-window-labels">
                          <span>Wind Hold Risk</span>
                          <span>${windHoldRiskLabel}</span>
                        </div>
                        <div class="pow-watch-chart-head">Snowfall Trend</div>
                        <div class="pow-watch-chart-wrap">
                          <div class="pow-watch-chart-axis">
                            <span>${chartMaxLabel}</span>
                            <span>${chartMidLabel}</span>
                            <span>0.0"</span>
                          </div>
                          <div class="pow-watch-chart" aria-label="Hourly snow trend next 72 hours">
                            ${chartBars}
                          </div>
                        </div>
                        <div class="pow-watch-chart-scale">
                          <span>Now</span>
                          <span>24h</span>
                          <span>48h</span>
                          <span>72h</span>
                        </div>
                        <div class="pow-watch-chart-units">${chartLegend}</div>
                      </div>
                    </details>
                  </div>
                </div>

                <div class="rating-section">
                  <div>
                    <div class="rating-label icecoast-title">Icecoast Rating</div>
                    <div class="rating-stars">${stars}</div>
                  </div>
                  <div class="rating-text">
                    ${getRatingText(resort.rating, resort.snowfall24h, resort)}
                  </div>
                </div>

                <div class="mountain-ops-section">
                  <div class="mountain-ops-title">Logistics</div>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">
                        <span class="info-icon">${icons.ticket}</span>
                        Lift Ticket
                        ${passes.length
                            ? `<span class="ticket-label-badges">${passes.map(pass =>
                                `<span class="pass-badge pass-${pass}">${
                                    pass === 'ikon' ? 'Ikon' : (pass === 'epic' ? 'Epic' : (pass === 'indy' ? 'Indy' : pass))
                                }</span>`
                              ).join('')}</span>`
                            : ''}
                      </span>
                      <div class="ticket-info-stack">
                        <div class="ticket-price-line">
                          <span class="info-value ticket-price">
                            ${resort.liftTicket?.weekday ?? '—'}${resort.dynamicPricing && resort.liftTicket?.weekend ? ` / ${resort.liftTicket.weekend}` : ''}
                          </span>
                          ${resort.dynamicPricing ? '<span class="ticket-dynamic-note">Varies</span>' : ''}
                        </div>
                      </div>
                    </div>

                    <div class="info-item">
                      <span class="info-label">
                        <span class="info-icon">${icons.parking}</span>
                        Parking
                      </span>
                      <span class="info-value">${resort.parking || 'Unknown'}</span>
                    </div>

                    <div class="info-item">
                      <span class="info-label">
                        <span class="info-icon">${icons.mountain}</span>
                        Vertical Drop
                      </span>
                      <span class="info-value">${vertical}ft</span>
                    </div>

                    <div class="info-item">
                      <span class="info-label">
                        <span class="info-icon">${icons.trail}</span>
                        Trails
                      </span>
                      <div class="trail-status">
                        <span class="trail-badge open">${trailsOpen} Open</span>
                        <span class="trail-badge closed">${trailsClosed} Closed</span>
                      </div>
                    </div>

                    ${park > 0 ? `
                    <div class="info-item">
                      <span class="info-label">
                        <span class="info-icon">${icons.park}</span>
                        Park
                      </span>
                      <span class="info-value">
                        ${'⭐'.repeat(Math.min(park, 3))}
                        ${park >= 3 ? 'Epic' : park === 2 ? 'Solid' : 'Basic'}
                      </span>
                    </div>` : ''}
                  </div>

                  <details class="lift-details">
                    <summary class="lift-toggle">
                      <span class="lift-toggle-left">
                        <span class="info-icon" style="display:inline-flex;vertical-align:middle;">${icons.lift}</span>
                        Lifts Status${showLiftMoon ? ' 🌙' : ''}
                      </span>
                      <span style="display:flex;align-items:center;gap:0.5rem;">
                        <span class="trail-badge open" style="font-size:0.7rem;padding:0.2rem 0.5rem;">
                        ${liftsOpen} / ${(resort.lifts?.total ?? liftsOpen ?? '—')}
                        </span>
                        <span>
                          <svg class="lift-toggle-chevron" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" stroke-width="2.5"
                               stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </span>
                    </summary>
                    <div class="lift-list">
                      ${resort.liftDetails
                          ? Object.entries(resort.liftDetails)
                              .sort(([, a], [, b]) => {
                                const order = { open: 0, hold: 1, scheduled: 2, closed: 3 };
                                return (order[a] ?? 4) - (order[b] ?? 4);
                              })
                              .map(([name, status]) => `
                                <div class="lift-item">
                                  <span class="lift-dot ${status}"></span>
                                  <span class="lift-name ${status === 'closed' || status === 'scheduled'
                                      ? 'closed-lift' : ''}" title="${name}">${name}</span>
                                  <span class="lift-status">${status}</span>
                                </div>
                              `).join('')
                          : `<div class="lift-no-data">Detailed lift status unavailable for this resort</div>`
                      }
                    </div>
                  </details>
                </div>

                <div class="extra-ratings">
                  <div class="extra-rating-item">
                    <span class="extra-label">
                      Après
                    </span>
                    <span class="extra-rating-track" aria-hidden="true">
                      ${Array.from({ length: 5 }, (_, i) => `<span class="extra-rating-icon ${i < apresScore ? 'filled' : 'empty'}">🍺</span>`).join('')}
                    </span>
                  </div>
                  <div class="extra-rating-item">
                    <span class="extra-label">
                      Family
                    </span>
                    <span class="extra-rating-track" aria-hidden="true">
                      ${Array.from({ length: 5 }, (_, i) => `<span class="extra-rating-icon ${i < familyScore ? 'filled' : 'empty'}">👶</span>`).join('')}
                    </span>
                  </div>
                </div>

                <div class="distance-info">
                  <div class="distance-title-row">
                    <div class="distance-title">
                      <span class="distance-title-icon" aria-hidden="true">${icons.car}</span>
                      <span>Drive Time</span>
                    </div>
                    <div class="distance-title distance-title-right">
                      <span class="distance-title-icon" aria-hidden="true">${icons.myLocation}</span>
                      <span>Your drive</span>
                    </div>
                  </div>
                  <div class="distance-layout">
                    <div class="distance-list">
                      ${distanceEntries.length
                          ? distanceEntries.map(([city, time]) => `
                              <div class="distance-item"><strong>${city}</strong> ${time}</div>
                            `).join('')
                          : '<div class="distance-item">Drive time unavailable</div>'}
                    </div>
                    <div class="distance-eta-panel">
                      <div class="distance-eta-value">${etaValue}</div>
                      <button class="eta-btn" data-eta-action="get" data-resort-id="${resort.id}" type="button" ${etaButtonDisabled ? 'disabled' : ''}>
                        ${etaButtonLabel}
                      </button>
                      <div class="distance-eta-note ${etaSubline ? (etaState?.status || '') : 'empty'}">${etaSubline || '&nbsp;'}</div>
                    </div>
                  </div>
                </div>

                <div class="sendit-section">
                  <div class="sendit-header">
                    <div class="sendit-title-row">
                      <div class="sendit-title-pill">
                        <div class="sendit-title">SLOPE SIGNAL</div>
                      </div>
                      <div class="sendit-explainer">Local mountain check</div>
                    </div>
                    <div class="sendit-subline">
                      <span class="sendit-main-read">
                        <span class="sendit-live-dot signal-${sendItTone}" aria-hidden="true"></span>
                        <span class="sendit-subtitle">${signalLead}</span>
                      </span>
                      ${sendItSubtitleSecondary ? `<span class="sendit-subtitle-flavor">${sendItSubtitleSecondary}</span>` : ''}
                    </div>
                    ${difficultyMixMarkup}
                  </div>
                  ${sendItPrompt}
                  ${sendItControls}
                  ${`
                  <div class="sendit-history-divider" aria-hidden="true"></div>
                  <div class="sendit-history-row" aria-label="Slope Signal history">
                    <span class="sendit-history-item"><strong>24h</strong> <em>${sendItSummary24h}</em></span>
                  </div>`}
                </div>
                </div>
                <div class="resort-card-divider" aria-hidden="true"></div>
              </div>
            </div>
          `;
        }


        let filterState = {
            regions: [],
            passes: [],
            vibe: 'all',
            signal: 'all',
            sort: 'rating-high', // Start with best conditions
            search: ''
        };
        const FAVORITES_STORAGE_KEY = 'icecoast_favorites_v1';
        const FEATURE_TAB_STORAGE_KEY = 'icecoast_feature_tab_v1';
        const ALLOWED_FEATURE_TABS = new Set(['all', 'favorites']);
        let favoriteResortIds = new Set();
        let activeFeatureTab = 'all';

        function loadFavoriteResortIds() {
            try {
                const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
                if (!raw) return new Set();
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return new Set();
                return new Set(parsed.map((id) => String(id || '').trim()).filter(Boolean));
            } catch (_) {
                return new Set();
            }
        }

        function loadActiveFeatureTab() {
            try {
                const stored = String(localStorage.getItem(FEATURE_TAB_STORAGE_KEY) || '').trim().toLowerCase();
                if (ALLOWED_FEATURE_TABS.has(stored)) return stored;
            } catch (_) {}
            return 'all';
        }

        function saveActiveFeatureTab(tab) {
            try {
                localStorage.setItem(FEATURE_TAB_STORAGE_KEY, tab);
            } catch (_) {}
        }

        function saveFavoriteResortIds() {
            try {
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favoriteResortIds)));
            } catch (_) {}
        }

        function isFavoriteResort(resortId) {
            return favoriteResortIds.has(String(resortId || '').trim());
        }

        function setFavoriteResort(resortId, shouldFavorite) {
            const id = String(resortId || '').trim();
            if (!id) return;
            if (shouldFavorite) {
                favoriteResortIds.add(id);
            } else {
                favoriteResortIds.delete(id);
            }
            saveFavoriteResortIds();
        }

        function animateFavoriteBookmark(resortId, saved) {
            const id = String(resortId || '').trim();
            if (!id) return;
            const selectorId = (window.CSS && typeof window.CSS.escape === 'function') ? window.CSS.escape(id) : id;
            const btn = document.querySelector(`[data-favorite-resort="${selectorId}"]`);
            if (!btn) return;
            btn.classList.remove('saved', 'unsaving');
            void btn.offsetWidth;
            btn.classList.add(saved ? 'saved' : 'unsaving');
            setTimeout(() => {
                btn.classList.remove('saved', 'unsaving');
            }, 520);
        }

        function animateShareButton(shareBtnEl) {
            if (!shareBtnEl) return;
            if (shareBtnEl.dataset.shareAnimating === '1') return;
            shareBtnEl.dataset.shareAnimating = '1';
            shareBtnEl.classList.remove('firing', 'raining', 'resetting');
            void shareBtnEl.offsetWidth;
            shareBtnEl.classList.add('firing');
            setTimeout(() => {
                shareBtnEl.classList.remove('firing');
                void shareBtnEl.offsetWidth;
                shareBtnEl.classList.add('raining');
            }, 280);
            setTimeout(() => {
                shareBtnEl.classList.remove('raining');
                void shareBtnEl.offsetWidth;
                shareBtnEl.classList.add('resetting');
            }, 700);
            setTimeout(() => {
                shareBtnEl.classList.remove('resetting');
                shareBtnEl.dataset.shareAnimating = '0';
            }, 1000);
        }

        function toggleFavoriteResort(resortId) {
            const id = String(resortId || '').trim();
            if (!id) return false;
            const next = !favoriteResortIds.has(id);
            setFavoriteResort(id, next);
            return next;
        }

        function syncFeatureTabButtons() {
            document.querySelectorAll('[data-feature-tab]').forEach((btn) => {
                const tab = btn.dataset.featureTab;
                btn.classList.toggle('active', tab === activeFeatureTab);
            });
            const favoritesTabCountEl = document.getElementById('favoritesTabCount');
            if (favoritesTabCountEl) {
                const count = favoriteResortIds.size;
                favoritesTabCountEl.textContent = String(count);
                favoritesTabCountEl.classList.toggle('visible', count > 0);
            }
        }

        let favoriteToastTimer = null;
        function showFavoriteToast(message) {
            if (typeof document === 'undefined') return;
            let toast = document.getElementById('favoriteToast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'favoriteToast';
                toast.className = 'favorite-toast';
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.classList.add('show');
            if (favoriteToastTimer) {
                clearTimeout(favoriteToastTimer);
            }
            favoriteToastTimer = setTimeout(() => {
                toast.classList.remove('show');
            }, 1100);
        }

        function pulseFavoritesTab() {
            const favoritesTab = document.querySelector('[data-feature-tab="favorites"]');
            if (!favoritesTab) return;
            favoritesTab.classList.remove('pulse-pop');
            void favoritesTab.offsetWidth;
            favoritesTab.classList.add('pulse-pop');
        }

        const deepLinkResortId = (typeof window !== 'undefined')
            ? (() => {
                const queryResort = (new URLSearchParams(window.location.search).get('resort') || '').trim().toLowerCase();
                if (queryResort) return queryResort;
                const hash = String(window.location.hash || '').replace(/^#/, '').trim().toLowerCase();
                const m = hash.match(/^resort-([a-z0-9-]+)$/);
                return m ? m[1] : '';
            })()
            : '';
        let deepLinkHandled = false;

        function getSlopeSignalSortScore(resort) {
            if (!resort || typeof resort !== 'object') {
                return { score: 0, votes: 0 };
            }
            const sendIt = sendItSummaryByResort?.[resort.id];
            const voteCount = Number.isFinite(Number(sendIt?.votes)) ? Number(sendIt.votes) : 0;
            const sendItScore = Number.isFinite(Number(sendIt?.score)) ? Number(sendIt.score) : null;
            const fallbackRating = Number.isFinite(Number(resort.rating))
                ? Number(resort.rating) * 20
                : 0;
            return {
                score: voteCount > 0 && sendItScore !== null ? sendItScore : fallbackRating,
                votes: voteCount
            };
        }

        function getPowWatchBandForResort(resort) {
            const totals = resort?.powWatch?.totals || {};
            const days = Array.isArray(resort?.powWatch?.days) ? resort.powWatch.days : [];
            const snow24 = Number(totals.snow24) || 0;
            const snow48 = Number(totals.snow48) || 0;
            const snow72 = Number(totals.snow72) || 0;
            const day0Snow = Number(days?.[0]?.snow) || 0;
            const day1Snow = Number(days?.[1]?.snow) || 0;

            if (snow24 >= 2 || day0Snow >= 2) return 'POW WATCH ON';
            if (snow48 >= 2 || snow72 >= 4 || day1Snow >= 2) return 'POW WATCH BUILDING';
            return 'POW WATCH QUIET';
        }

        function getPowWatchFilterBucketForResort(resort) {
            const status = String(resort?.powWatch?.statusLabel || '').trim().toUpperCase();
            if (status === 'ON' || status === 'ACTIVE' || status === 'STORM') return 'active';
            if (status === 'BUILDING' || status === 'INCOMING') return 'building';
            if (status === 'QUIET' || status === 'WINDY') return 'quiet';

            const band = getPowWatchBandForResort(resort);
            if (band === 'POW WATCH ON') return 'active';
            if (band === 'POW WATCH BUILDING') return 'building';
            return 'quiet';
        }

        function applyFilters() {
            let filtered = Array.isArray(resorts) ? resorts.filter(Boolean) : [];
            const searchTerm = (filterState.search || '').trim().toLowerCase();

            if (searchTerm) {
                filtered = filtered.filter((r) => {
                    const name = String(r?.name || '').toLowerCase();
                    const location = String(r?.location || '').toLowerCase();
                    const region = String(r?.region || '').toLowerCase();
                    return name.includes(searchTerm) || location.includes(searchTerm) || region.includes(searchTerm);
                });
            }

            if (activeFeatureTab === 'favorites') {
                filtered = filtered.filter((r) => favoriteResortIds.has(String(r?.id || '')));
            }

            if (Array.isArray(filterState.regions) && filterState.regions.length > 0) {
                filtered = filtered.filter((r) => {
                    return filterState.regions.some((selectedRegion) => {
                        if (selectedRegion === 'new-york') {
                            return r.region === 'catskills' || r.region === 'adirondacks';
                        }
                        return r.region === selectedRegion;
                    });
                });
            }

            if (Array.isArray(filterState.passes) && filterState.passes.length > 0) {
                filtered = filtered.filter((r) => {
                    return filterState.passes.some((selectedPass) => {
                        if (selectedPass === 'none') {
                            return !r.passes || r.passes.length === 0;
                        }
                        return r.passes && r.passes.includes(selectedPass);
                    });
                });
            }

            if (filterState.vibe === 'on') {
                filtered = filtered.filter((r) => getPowWatchFilterBucketForResort(r) === 'active');
            } else if (filterState.vibe === 'building') {
                filtered = filtered.filter((r) => getPowWatchFilterBucketForResort(r) === 'building');
            } else if (filterState.vibe === 'quiet') {
                filtered = filtered.filter((r) => getPowWatchFilterBucketForResort(r) === 'quiet');
            }

            if (filterState.signal === 'send' || filterState.signal === 'avoid') {
                filtered = filtered.filter((r) => {
                    const sendIt = sendItSummaryByResort?.[r.id] || {};
                    const votes24h = Number.isFinite(Number(sendIt.votes24h)) ? Number(sendIt.votes24h) : 0;
                    const score24h = Number.isFinite(Number(sendIt.score24h)) ? Number(sendIt.score24h) : null;
                    const scoreOverall = Number.isFinite(Number(sendIt.score)) ? Number(sendIt.score) : null;
                    const score = score24h !== null ? score24h : scoreOverall;

                    if (votes24h < 1 || !Number.isFinite(score)) {
                        return false;
                    }

                    if (filterState.signal === 'send') {
                        return score >= 70;
                    }
                    return score < 45;
                });
            }

            switch (filterState.sort) {
                case 'rating-high':
                    filtered.sort((a, b) => b.rating - a.rating);
                    break;
                case 'rating-low':
                    filtered.sort((a, b) => a.rating - b.rating);
                    break;
                case 'snow-24h':
                    filtered.sort((a, b) => {
                        const aSnow = (a.snowfall && a.snowfall['24h']) ? parseInt(a.snowfall['24h']) : 0;
                        const bSnow = (b.snowfall && b.snowfall['24h']) ? parseInt(b.snowfall['24h']) : 0;
                        return bSnow - aSnow;
                    });
                    break;
                case 'price-low':
                    filtered.sort((a, b) => {
                        const aPrice = parsePriceToNumber(a.liftTicket?.weekend, 999);
                        const bPrice = parsePriceToNumber(b.liftTicket?.weekend, 999);
                        return aPrice - bPrice;
                    });
                    break;
                case 'price-high':
                    filtered.sort((a, b) => {
                        const aPrice = parsePriceToNumber(a.liftTicket?.weekend, 0);
                        const bPrice = parsePriceToNumber(b.liftTicket?.weekend, 0);
                        return bPrice - aPrice;
                    });
                    break;
                case 'name':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }

            return filtered;
        }

        function renderResorts() {
            const grid = document.getElementById('resortGrid');
            const filtered = applyFilters();

            if (filtered.length === 0) {
                if (activeFeatureTab === 'favorites') {
                    grid.innerHTML = `<div class="loading" style="grid-column: 1/-1;">No favorites yet. Tap the bookmark on any resort to build your list.</div>`;
                    return;
                }
                const snarkMessages = [
                    "No resorts match your filters. Ice builds character.",
                    "No resorts match your filters. Conditions: character-building.",
                    "No resorts match your filters. Lower expectations, higher stoke.",
                    "No resorts match your filters. This isn't Colorado.",
                    "No resorts match your filters. Go sharpen your edges."
                ];
                const avoidMessages = [
                    "avoid grom says low tide, but a few firm laps still count as skiing.",
                    "avoid grom found chatter city. Tune the edges and farm the side hits.",
                    "avoid grom says boilerplate vibes. Keep it technical and stack clean turns.",
                    "avoid grom picked spicy snow. Ski smart, stay loose, and grab the best pockets.",
                    "avoid grom says survival-carve weather, not no-ski weather.",
                    "avoid grom found crunchy cord. Bring sharp steel and make it a skills day.",
                    "avoid grom says sketchy in spots. Locals still get quality laps with good line choice.",
                    "avoid grom called it firm and fast. Time to polish technique and send controlled."
                ];
                const messages = (filterState.vibe === 'quiet' || filterState.signal === 'avoid') ? avoidMessages : snarkMessages;
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                grid.innerHTML = `<div class="loading" style="grid-column: 1/-1;">${randomMessage}</div>`;
                return;
            }

            grid.innerHTML = filtered.map(resort => createResortCard(resort)).join('');
            focusResortFromDeepLink();
        }

        const PUBLIC_SHARE_BASE_URL = 'https://icecoast.ski/';

        function getResortShareUrl(resortId) {
            const shareUrl = new URL(PUBLIC_SHARE_BASE_URL);
            shareUrl.searchParams.set('resort', resortId);
            shareUrl.hash = `resort-${resortId}`;
            return shareUrl.toString();
        }

        function focusResortFromDeepLink() {
            if (deepLinkHandled || !deepLinkResortId) return;
            const card = document.querySelector(`.resort-card[data-resort="${deepLinkResortId}"]`);
            if (!card) return;
            deepLinkHandled = true;
            setTimeout(() => {
                const headerEl = card.querySelector('.resort-header') || card;
                const getStickyOffset = () => {
                    const header = document.querySelector('header');
                    const newsletter = document.querySelector('.newsletter-banner');
                    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
                    const newsletterHeight = newsletter ? Math.ceil(newsletter.getBoundingClientRect().height) : 0;
                    return headerHeight + newsletterHeight + 8;
                };
                const scrollToHeaderTop = () => {
                    const headerTop = headerEl.getBoundingClientRect().top + window.scrollY;
                    const targetTop = Math.max(0, headerTop - getStickyOffset());
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                };
                scrollToHeaderTop();
                setTimeout(scrollToHeaderTop, 260);
                card.classList.add('share-focus');
                setTimeout(() => card.classList.remove('share-focus'), 2200);
            }, 120);
        }

        function syncRegionFilterButtons() {
            const selected = new Set(filterState.regions || []);
            document.querySelectorAll('[data-region]').forEach((b) => {
                const val = b.dataset.region;
                if (val === 'all') {
                    b.classList.toggle('active', selected.size === 0);
                } else {
                    b.classList.toggle('active', selected.has(val));
                }
            });
        }

        function syncPassFilterButtons() {
            const selected = new Set(filterState.passes || []);
            document.querySelectorAll('[data-pass]').forEach((b) => {
                const val = b.dataset.pass;
                if (val === 'all') {
                    b.classList.toggle('active', selected.size === 0);
                } else {
                    b.classList.toggle('active', selected.has(val));
                }
            });
        }

        document.querySelectorAll('[data-region]').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.region;
                const selected = new Set(filterState.regions || []);
                if (value === 'all') {
                    selected.clear();
                } else if (selected.has(value)) {
                    selected.delete(value);
                } else {
                    selected.add(value);
                }
                filterState.regions = Array.from(selected);
                syncRegionFilterButtons();
                renderResorts();
            });
        });
        function toggleLegal() {
            const accordion = document.getElementById('legalAccordion');
            const toggle = document.querySelector('.legal-toggle');

            accordion.classList.toggle('open');
            toggle.classList.toggle('active');
        }
        document.querySelectorAll('[data-pass]').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.pass;
                const selected = new Set(filterState.passes || []);
                if (value === 'all') {
                    selected.clear();
                } else if (selected.has(value)) {
                    selected.delete(value);
                } else {
                    selected.add(value);
                }
                filterState.passes = Array.from(selected);
                syncPassFilterButtons();
                renderResorts();
            });
        });

        document.querySelectorAll('[data-vibe]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-vibe]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterState.vibe = btn.dataset.vibe;
                renderResorts();
            });
        });

        document.querySelectorAll('[data-signal]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-signal]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterState.signal = btn.dataset.signal;
                renderResorts();
            });
        });

        document.querySelectorAll('[data-feature-tab]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tab = String(btn.dataset.featureTab || '').trim();
                if (!ALLOWED_FEATURE_TABS.has(tab)) return;
                activeFeatureTab = tab;
                saveActiveFeatureTab(tab);
                syncFeatureTabButtons();
                renderResorts();
            });
        });

        document.getElementById('sortSelect').addEventListener('change', (e) => {
            filterState.sort = e.target.value;
            renderResorts();
        });

        const resortSearchInput = document.getElementById('resortSearch');
        const clearResortSearchBtn = document.getElementById('clearResortSearch');
        const searchWrap = resortSearchInput ? resortSearchInput.closest('.filter-search-wrap') : null;
        const searchIconWrapEl = document.getElementById('searchIconWrap');
        const searchTextClipEl = document.getElementById('searchTextClip');
        const searchPhrases = [
            'Find your line.',
            'Know the snow before you go.',
            'Find your ski resort.',
            'Track the next storm window.'
        ];
        const SEARCH_HOLD_MS = 2600;
        const SEARCH_SPIN_MS = 620;
        let searchCycleTimer = null;
        let searchCurrentPhraseIndex = 0;
        let searchActivePhraseEl = null;
        function clearSearchCycleTimer() {
            if (searchCycleTimer) {
                clearTimeout(searchCycleTimer);
                searchCycleTimer = null;
            }
        }
        function syncSearchInteractionState() {
            if (!searchWrap || !resortSearchInput) return;
            const hasValue = (resortSearchInput.value || '').trim().length > 0;
            const isFocused = document.activeElement === resortSearchInput;
            searchWrap.classList.toggle('search-has-value', hasValue);
            searchWrap.classList.toggle('search-focused', isFocused);
        }
        function spinSearchIcon() {
            if (!searchIconWrapEl) return;
            searchIconWrapEl.classList.remove('spinning');
            void searchIconWrapEl.offsetWidth;
            searchIconWrapEl.classList.add('spinning');
        }
        function showNextSearchPhrase() {
            if (!searchTextClipEl || !searchPhrases.length || !resortSearchInput) return;
            const hasValue = (resortSearchInput.value || '').trim().length > 0;
            const isFocused = document.activeElement === resortSearchInput;
            if (hasValue || isFocused) {
                syncSearchInteractionState();
                clearSearchCycleTimer();
                searchCycleTimer = setTimeout(showNextSearchPhrase, 220);
                return;
            }
            if (!searchActivePhraseEl) {
                const bootPhraseEl = document.createElement('span');
                bootPhraseEl.className = 'search-phrase active';
                bootPhraseEl.textContent = searchPhrases[searchCurrentPhraseIndex] || searchPhrases[0];
                searchTextClipEl.appendChild(bootPhraseEl);
                searchActivePhraseEl = bootPhraseEl;
                searchCurrentPhraseIndex = (searchCurrentPhraseIndex + 1) % searchPhrases.length;
                clearSearchCycleTimer();
                searchCycleTimer = setTimeout(showNextSearchPhrase, SEARCH_HOLD_MS);
                return;
            }
            spinSearchIcon();

            const incomingPhraseEl = document.createElement('span');
            incomingPhraseEl.className = 'search-phrase standby';
            incomingPhraseEl.textContent = searchPhrases[searchCurrentPhraseIndex] || searchPhrases[0];
            searchTextClipEl.appendChild(incomingPhraseEl);

            const enterDelayMs = Math.round(SEARCH_SPIN_MS * 0.35);
            setTimeout(() => {
                incomingPhraseEl.getBoundingClientRect();
                incomingPhraseEl.classList.remove('standby');
                incomingPhraseEl.classList.add('active');

                if (searchActivePhraseEl) {
                    const outgoingPhraseEl = searchActivePhraseEl;
                    outgoingPhraseEl.classList.remove('active');
                    outgoingPhraseEl.classList.add('exit');
                    outgoingPhraseEl.addEventListener('transitionend', () => {
                        outgoingPhraseEl.remove();
                    }, { once: true });
                }
                searchActivePhraseEl = incomingPhraseEl;
            }, enterDelayMs);

            searchCurrentPhraseIndex = (searchCurrentPhraseIndex + 1) % searchPhrases.length;
            clearSearchCycleTimer();
            searchCycleTimer = setTimeout(showNextSearchPhrase, SEARCH_HOLD_MS);
        }
        function initSearchTyping() {
            if (!searchWrap || !resortSearchInput || !searchTextClipEl || !searchPhrases.length) return;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const staticPhraseEl = document.createElement('span');
                staticPhraseEl.className = 'search-phrase active';
                staticPhraseEl.textContent = searchPhrases[0];
                searchTextClipEl.appendChild(staticPhraseEl);
                searchActivePhraseEl = staticPhraseEl;
                syncSearchInteractionState();
                return;
            }
            const initialPhraseEl = document.createElement('span');
            initialPhraseEl.className = 'search-phrase active';
            initialPhraseEl.textContent = searchPhrases[0];
            searchTextClipEl.appendChild(initialPhraseEl);
            searchActivePhraseEl = initialPhraseEl;
            searchCurrentPhraseIndex = 1 % searchPhrases.length;
            clearSearchCycleTimer();
            searchCycleTimer = setTimeout(showNextSearchPhrase, SEARCH_HOLD_MS);
        }
        function clearResortSearchField() {
            if (!resortSearchInput) return;
            resortSearchInput.value = '';
            filterState.search = '';
            syncSearchClearButton();
            renderResorts();
            resortSearchInput.focus();
        }
        function syncSearchClearButton() {
            if (!clearResortSearchBtn || !resortSearchInput) return;
            const hasValue = (resortSearchInput.value || '').trim().length > 0;
            clearResortSearchBtn.classList.toggle('visible', hasValue);
            syncSearchInteractionState();
        }
        if (resortSearchInput) {
            resortSearchInput.addEventListener('input', (e) => {
                filterState.search = e.target.value || '';
                syncSearchClearButton();
                renderResorts();
            });
            resortSearchInput.addEventListener('focus', () => {
                syncSearchInteractionState();
            });
            resortSearchInput.addEventListener('blur', () => {
                syncSearchInteractionState();
            });
        }
        if (clearResortSearchBtn && resortSearchInput) {
            clearResortSearchBtn.addEventListener('click', clearResortSearchField);
            clearResortSearchBtn.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                clearResortSearchField();
            });
            clearResortSearchBtn.addEventListener('touchend', (event) => {
                event.preventDefault();
                clearResortSearchField();
            }, { passive: false });
        }
        syncSearchClearButton();
        initSearchTyping();
        syncRegionFilterButtons();
        syncPassFilterButtons();
        favoriteResortIds = loadFavoriteResortIds();
        activeFeatureTab = loadActiveFeatureTab();
        syncFeatureTabButtons();

        const shareModalOverlay = document.getElementById('shareModalOverlay');
        const shareModalClose = document.getElementById('shareModalClose');
        const shareModalResort = document.getElementById('shareModalResort');
        const shareModalStatus = document.getElementById('shareModalStatus');
        const shareDownloadBtn = document.getElementById('shareDownloadBtn');
        const shareSaveImageLink = document.getElementById('shareSaveImageLink');
        const shareCopyBtn = document.getElementById('shareCopyBtn');
        const shareNativeBtn = document.getElementById('shareNativeBtn');
        const shareXBtn = document.getElementById('shareXBtn');
        const shareFacebookBtn = document.getElementById('shareFacebookBtn');
        let activeSharePayload = null;
        let activeShareImageUrl = null;

        function closeShareModal() {
            if (!shareModalOverlay) return;
            shareModalOverlay.classList.remove('open');
            shareModalOverlay.setAttribute('aria-hidden', 'true');
            if (shareModalStatus) shareModalStatus.textContent = '';
            if (shareSaveImageLink) {
                shareSaveImageLink.classList.add('is-hidden');
                shareSaveImageLink.removeAttribute('href');
                shareSaveImageLink.removeAttribute('download');
            }
            if (activeShareImageUrl) {
                URL.revokeObjectURL(activeShareImageUrl);
                activeShareImageUrl = null;
            }
            activeSharePayload = null;
        }

        function openShareModal(resortId) {
            if (!shareModalOverlay) return;
            const resort = resorts.find((r) => r.id === resortId);
            if (!resort) return;
            const url = getResortShareUrl(resortId);
            const snowfall24ForBubble = resort?.snowfall?.['24h'] ?? resort?.snowfall24h ?? '0';
            const ratingForBubble = Math.max(0, Math.min(5, Math.round(Number(resort.rating) || 0)));
            const bubblePhrase = getRatingText(ratingForBubble, snowfall24ForBubble, resort);
            const conditionLabel = (resort.conditions || 'Current conditions').trim();
            const artUrl = getPublicShareArtUrl(resortId);
            const text = `${conditionLabel} @ ${resort.name}! ${bubblePhrase}\n${artUrl}\n${url}`;
            activeSharePayload = {
                resortId,
                name: resort.name,
                url,
                text,
                artUrl
            };

            if (shareModalResort) {
                shareModalResort.textContent = resort.name;
            }
            if (shareModalStatus) {
                shareModalStatus.textContent = '';
            }
            if (shareSaveImageLink) {
                shareSaveImageLink.classList.add('is-hidden');
                shareSaveImageLink.removeAttribute('href');
                shareSaveImageLink.removeAttribute('download');
            }
            if (activeShareImageUrl) {
                URL.revokeObjectURL(activeShareImageUrl);
                activeShareImageUrl = null;
            }
            if (shareNativeBtn) {
                shareNativeBtn.style.display = 'inline-flex';
            }

            shareModalOverlay.classList.add('open');
            shareModalOverlay.setAttribute('aria-hidden', 'false');
        }

        function setShareStatus(text) {
            if (!shareModalStatus) return;
            shareModalStatus.textContent = text || '';
        }

        function loadImageForShare(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                if (/^https?:\/\//i.test(src)) {
                    img.crossOrigin = 'anonymous';
                }
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        }

        function drawRoundRect(ctx, x, y, w, h, r) {
            const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + w, y, x + w, y + h, radius);
            ctx.arcTo(x + w, y + h, x, y + h, radius);
            ctx.arcTo(x, y + h, x, y, radius);
            ctx.arcTo(x, y, x + w, y, radius);
            ctx.closePath();
        }

        function drawImageCover(ctx, img, x, y, w, h) {
            const scale = Math.max(w / img.width, h / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            const dx = x + (w - dw) / 2;
            const dy = y + (h - dh) / 2;
            ctx.drawImage(img, dx, dy, dw, dh);
        }

        function getShareArtFile(resortId) {
            const shareArtOverrides = {
                'camelback': 'camelback.jpg',
                'cannon': 'cannon.jpg?v=20260208ab',
                'catamount': 'jiminy-peak.jpg',
                'berkshire-east': 'jiminy-peak.jpg',
                'bolton-valley': 'burke.jpg',
                'plattekill': 'belleayre.jpg',
                'black-mountain': 'wildcat.jpg',
                'magic-mountain': 'mad-river-glen.jpg',
                'ragged-mountain': 'waterville.jpg',
                'sunapee': 'waterville.jpg',
                'pats-peak': 'wachusett.jpg'
            };
            return shareArtOverrides[resortId] || `${resortId}.jpg`;
        }

        function getShareArtUrls(resortId) {
            const legacyFile = getShareArtFile(resortId);
            const legacyBase = String(legacyFile).replace(/\?.*$/, '');
            const stem = legacyBase.replace(/\.(png|jpe?g|webp)$/i, '');
            return [
                new URL(`new-resort-art/${stem}.jpg`, window.location.href).toString(),
                new URL(`new-resort-art/${stem}.png`, window.location.href).toString(),
                new URL(`resort-art/${legacyFile}`, window.location.href).toString(),
            ];
        }

        function getPublicShareArtUrl(resortId) {
            const legacyFile = getShareArtFile(resortId);
            const legacyBase = String(legacyFile).replace(/\?.*$/, '');
            const stem = legacyBase.replace(/\.(png|jpe?g|webp)$/i, '');
            return `${PUBLIC_SHARE_BASE_URL}new-resort-art/${stem}.png`;
        }

        function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
            const words = String(text || '').split(/\s+/).filter(Boolean);
            const lines = [];
            let line = '';
            words.forEach((word) => {
                const testLine = line ? `${line} ${word}` : word;
                if (ctx.measureText(testLine).width <= maxWidth || !line) {
                    line = testLine;
                } else {
                    lines.push(line);
                    line = word;
                }
            });
            if (line) lines.push(line);
            lines.forEach((ln, idx) => {
                ctx.fillText(ln, x, y + (idx * lineHeight));
            });
            return lines.length;
        }

        async function buildResortShareImage(resort) {
            const width = 1080;
            const height = 1480;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            ctx.fillStyle = '#eef3fb';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, 120);
            ctx.fillStyle = '#131a27';
            ctx.font = '800 54px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText('ice', 44, 74);
            const iceWidth = ctx.measureText('ice').width;
            ctx.fillStyle = '#1f5ec8';
            ctx.fillText('coast', 44 + iceWidth + 6, 74);
            ctx.fillStyle = '#34435a';
            ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText('know the snow before you go', 44, 104);

            const cardX = 28;
            const cardY = 136;
            const cardW = width - 56;
            const cardH = height - cardY - 28;
            const headerH = 360;

            drawRoundRect(ctx, cardX, cardY, cardW, cardH, 28);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const artUrls = getShareArtUrls(resort.id);
            ctx.save();
            drawRoundRect(ctx, cardX, cardY, cardW, headerH, 28);
            ctx.clip();

            try {
                let art = null;
                for (const url of artUrls) {
                    try {
                        art = await loadImageForShare(url);
                        if (art) break;
                    } catch (_) {
                    }
                }
                if (!art) throw new Error('no art image');
                drawImageCover(ctx, art, cardX, cardY, cardW, headerH);
            } catch (_) {
                ctx.fillStyle = '#dbe8fb';
                ctx.fillRect(cardX, cardY, cardW, headerH);
            }

            const headerFade = ctx.createLinearGradient(0, cardY + 90, 0, cardY + headerH);
            headerFade.addColorStop(0, 'rgba(6, 17, 38, 0.08)');
            headerFade.addColorStop(0.65, 'rgba(6, 17, 38, 0.36)');
            headerFade.addColorStop(1, 'rgba(6, 17, 38, 0.66)');
            ctx.fillStyle = headerFade;
            ctx.fillRect(cardX, cardY, cardW, headerH);
            ctx.restore();

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 66px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText(resort.name || 'Resort', cardX + 30, cardY + headerH - 74);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
            ctx.font = '600 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText(resort.location || '', cardX + 30, cardY + headerH - 30);

            const chipItems = [];
            const gladesScore = Number(resort.glades) || 0;
            if (gladesScore > 0) {
                chipItems.push({
                    text: gladesScore >= 3 ? 'ELITE GLADES' : (gladesScore === 2 ? 'EXCELLENT GLADES' : 'SOME GLADES'),
                    bg: '#5f7448',
                    fg: '#f4f8ff'
                });
            } else if (resort.familyOwned) {
                chipItems.push({ text: 'FAMILY-OWNED', bg: '#7b5a3e', fg: '#fff6ec' });
            }
            const pow24h = parseInt(resort?.snowfall?.['24h'] ?? resort?.snowfall24h ?? '0', 10);
            if (pow24h >= 6) {
                chipItems.push({ text: `${pow24h}" FRESH POW`, bg: '#1f7bff', fg: '#ffffff' });
            }
            let chipX = cardX + 28;
            const chipY = cardY + headerH - 6;
            chipItems.slice(0, 3).forEach((chip) => {
                ctx.font = '760 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                const chipW = Math.ceil(ctx.measureText(chip.text).width) + 28;
                const chipH = 34;
                drawRoundRect(ctx, chipX, chipY, chipW, chipH, 999);
                ctx.fillStyle = chip.bg;
                ctx.fill();
                ctx.fillStyle = chip.fg;
                ctx.fillText(chip.text, chipX + 14, chipY + 22);
                chipX += chipW + 10;
            });

            let y = cardY + headerH + 42;
            const left = cardX + 34;
            const contentW = cardW - 68;

            ctx.fillStyle = '#263246';
            ctx.font = '700 30px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText('CURRENT CONDITIONS', left, y);
            const confidenceText = (() => {
                const ts = Date.parse(resort.patrolUpdatedAt || '');
                if (Number.isFinite(ts)) {
                    const hoursOld = (Date.now() - ts) / (60 * 60 * 1000);
                    if (hoursOld <= 24) return 'Confidence: High';
                    if (hoursOld <= 48) return 'Confidence: Medium';
                }
                return 'Confidence: Basic';
            })();
            ctx.font = '760 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            const confW = Math.ceil(ctx.measureText(confidenceText).width) + 24;
            drawRoundRect(ctx, left + contentW - confW, y - 26, confW, 30, 8);
            ctx.fillStyle = '#e8f1ff';
            ctx.fill();
            ctx.fillStyle = '#1f3b68';
            ctx.fillText(confidenceText, left + contentW - confW + 12, y - 6);
            y += 54;

            ctx.fillStyle = '#144089';
            ctx.font = '800 64px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText(String(resort.conditions || 'Unknown'), left, y);
            y += 56;

            const snow24 = resort?.snowfall?.['24h'] || '0';
            const snow48 = resort?.snowfall?.['48h'] || '0';
            const temp = resort?.weather?.temp != null ? `${Math.round(Number(resort.weather.temp))}°F` : 'n/a';
            const wind = resort?.weather?.wind || 'n/a';
            const metrics = [`24h Snow ${snow24}"`, `48h Snow ${snow48}"`, `Temp ${temp}`, `Wind ${wind}`];
            const colW = contentW / 4;
            ctx.fillStyle = '#34435a';
            ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            metrics.forEach((m, i) => ctx.fillText(m, left + i * colW, y));
            y += 24;

            ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.beginPath();
            ctx.moveTo(left, y + 14);
            ctx.lineTo(left + contentW, y + 14);
            ctx.stroke();
            y += 58;

            ctx.fillStyle = '#263246';
            ctx.font = '800 50px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText('LOGISTICS', left, y);
            y += 54;

            const liftTicketWeekend = resort?.liftTicket?.weekend || resort?.liftTicket?.weekday || 'n/a';
            const parking = resort?.parking || 'n/a';
            const verticalDrop = resort?.verticalDrop || 'n/a';
            const trailsOpen = resort?.trails?.open || '0';
            const trailsTotal = resort?.trails?.total || '0';
            const liftsOpen = resort?.lifts?.open ?? resort?.liftStatus?.open ?? null;
            const liftsTotal = resort?.lifts?.total ?? resort?.liftStatus?.total ?? null;
            const liftText = liftsOpen != null && liftsTotal != null ? `${liftsOpen}/${liftsTotal}` : 'n/a';

            ctx.fillStyle = '#34435a';
            ctx.font = '800 27px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            const c2 = left + (contentW / 2) + 12;
            ctx.fillText(`Lift Ticket ${liftTicketWeekend}`, left, y);
            ctx.fillText(`Trails ${trailsOpen}/${trailsTotal}`, c2, y);
            y += 50;
            ctx.fillText(`Parking ${parking}`, left, y);
            ctx.fillText(`Lifts ${liftText}`, c2, y);
            y += 50;
            ctx.fillText(`Vertical Drop ${verticalDrop}`, left, y);
            y += 28;

            ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.beginPath();
            ctx.moveTo(left, y + 10);
            ctx.lineTo(left + contentW, y + 10);
            ctx.stroke();
            y += 54;

            ctx.fillStyle = '#263246';
            ctx.font = '700 46px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText('ICECOAST RATING', left, y);
            y += 58;

            const rating = Math.max(0, Math.min(5, Math.round(Number(resort.rating) || 0)));
            const stars = `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
            ctx.fillStyle = '#dca73f';
            ctx.font = '700 72px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText(stars, left, y);

            const snowfall24ForBubble = resort?.snowfall?.['24h'] ?? resort?.snowfall24h ?? '0';
            const ratingBubbleText = getRatingText(rating, snowfall24ForBubble, resort);
            const bubbleX = left + 300;
            const bubbleY = y - 56;
            const bubbleW = contentW - 300;
            const bubbleH = 86;
            drawRoundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 22);
            ctx.fillStyle = '#f6f8fc';
            ctx.fill();
            ctx.strokeStyle = 'rgba(20, 64, 137, 0.24)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bubbleX + 16, bubbleY + bubbleH - 12);
            ctx.lineTo(bubbleX - 6, bubbleY + bubbleH + 4);
            ctx.lineTo(bubbleX + 22, bubbleY + bubbleH - 2);
            ctx.closePath();
            ctx.fillStyle = '#f6f8fc';
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#144089';
            ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            drawWrappedText(ctx, ratingBubbleText, bubbleX + 18, bubbleY + 36, bubbleW - 30, 28);
            y += 72;

            ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.beginPath();
            ctx.moveTo(left, y + 10);
            ctx.lineTo(left + contentW, y + 10);
            ctx.stroke();
            y += 54;

            const apresScore = Math.max(0, Math.min(5, Math.round(Number(resort.apres) || 0)));
            const familyScore = Math.max(0, Math.min(5, Math.round(Number(resort.family) || 0)));
            const beerRow = `${'🍺'.repeat(apresScore)}${'·'.repeat(5 - apresScore)}`;
            const familyRow = `${'👶'.repeat(familyScore)}${'·'.repeat(5 - familyScore)}`;
            ctx.fillStyle = '#2a3b55';
            ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText(`Après ${beerRow}`, left, y);
            ctx.fillText(`Family ${familyRow}`, c2, y);
            y += 52;

            const distanceEntries = Object.entries(resort.distance || {})
                .sort(([, aTime], [, bTime]) => parseDriveTimeMinutes(aTime) - parseDriveTimeMinutes(bTime))
                .slice(0, 3);
            if (distanceEntries.length > 0) {
                ctx.fillStyle = '#263246';
                ctx.font = '700 34px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                ctx.fillText('DRIVE TIME', left, y);
                y += 38;
                ctx.fillStyle = '#34435a';
                ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                distanceEntries.forEach(([city, time]) => {
                    ctx.fillText(`${city} ${time}`, left, y);
                    y += 28;
                });
            }

            ctx.fillStyle = '#58729a';
            ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText('icecoast.ski', left, height - 42);

            return canvas;
        }

        if (shareModalClose) {
            shareModalClose.addEventListener('click', closeShareModal);
        }
        if (shareModalOverlay) {
            shareModalOverlay.addEventListener('click', (event) => {
                if (event.target === shareModalOverlay) {
                    closeShareModal();
                }
            });
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && shareModalOverlay?.classList.contains('open')) {
                closeShareModal();
            }
        });

        if (shareCopyBtn) {
            shareCopyBtn.addEventListener('click', async () => {
                if (!activeSharePayload) return;
                try {
                    await navigator.clipboard.writeText(activeSharePayload.url);
                    setShareStatus('Link copied.');
                } catch (_) {
                    setShareStatus('Copy blocked. You can copy from the address bar.');
                }
            });
        }

        if (shareDownloadBtn) {
            shareDownloadBtn.addEventListener('click', async () => {
                if (!activeSharePayload) return;
                try {
                    setShareStatus('Generating image...');
                    const resort = resorts.find((r) => r.id === activeSharePayload.resortId);
                    if (!resort) {
                        setShareStatus('Resort data not found.');
                        return;
                    }
                    const canvas = await buildResortShareImage(resort);
                    if (!canvas) {
                        setShareStatus('Image generation unavailable.');
                        return;
                    }
                    const fileName = `${activeSharePayload.resortId}-icecoast.png`;
                    const finalizeImageReady = (imageUrl) => {
                        if (shareSaveImageLink) {
                            shareSaveImageLink.href = imageUrl;
                            shareSaveImageLink.download = fileName;
                            shareSaveImageLink.classList.remove('is-hidden');
                        }
                        setShareStatus('Image ready. Tap "Save image now".');
                    };

                    if (typeof canvas.toBlob === 'function') {
                        canvas.toBlob((blob) => {
                            if (!blob) {
                                try {
                                    const dataUrl = canvas.toDataURL('image/png');
                                    finalizeImageReady(dataUrl);
                                } catch (_) {
                                    setShareStatus('Image export failed. Try Copy link instead.');
                                }
                                return;
                            }
                            const imageUrl = URL.createObjectURL(blob);
                            if (activeShareImageUrl) {
                                URL.revokeObjectURL(activeShareImageUrl);
                            }
                            activeShareImageUrl = imageUrl;
                            finalizeImageReady(imageUrl);
                        }, 'image/png');
                    } else {
                        const dataUrl = canvas.toDataURL('image/png');
                        finalizeImageReady(dataUrl);
                    }
                } catch (error) {
                    setShareStatus(`Image capture failed${error?.message ? `: ${error.message}` : ''}. Try Copy link instead.`);
                }
            });
        }

        if (shareNativeBtn) {
            shareNativeBtn.addEventListener('click', async () => {
                if (!activeSharePayload) return;
                const smsText = activeSharePayload.text;
                const smsHref = `sms:?&body=${encodeURIComponent(smsText)}`;
                try {
                    window.location.href = smsHref;
                    setShareStatus('Opening text app...');
                } catch (_) {
                    setShareStatus('Text share unavailable on this device.');
                }
            });
        }

        if (shareXBtn) {
            shareXBtn.addEventListener('click', () => {
                if (!activeSharePayload) return;
                const xText = `${activeSharePayload.name} conditions on icecoast`;
                const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(activeSharePayload.url)}`;
                window.open(href, '_blank', 'noopener,noreferrer');
            });
        }

        if (shareFacebookBtn) {
            shareFacebookBtn.addEventListener('click', () => {
                if (!activeSharePayload) return;
                const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeSharePayload.url)}&quote=${encodeURIComponent(activeSharePayload.text)}`;
                window.open(href, '_blank', 'noopener,noreferrer');
            });
        }

        document.addEventListener('click', (event) => {
            const favoriteTarget = event.target.closest('[data-favorite-resort]');
            if (favoriteTarget) {
                const resortId = favoriteTarget.dataset.favoriteResort;
                if (!resortId) return;
                const wasAdded = toggleFavoriteResort(resortId);
                syncFeatureTabButtons();
                pulseFavoritesTab();
                if (navigator.vibrate) {
                    navigator.vibrate(wasAdded ? [18, 12, 22] : [12]);
                }
                showFavoriteToast(wasAdded ? 'Saved to Favorites' : 'Removed from Favorites');
                renderResorts();
                animateFavoriteBookmark(resortId, wasAdded);
                return;
            }
            const shareTarget = event.target.closest('[data-share-resort]');
            if (!shareTarget) return;
            const resortId = shareTarget.dataset.shareResort;
            if (!resortId) return;
            animateShareButton(shareTarget);
            openShareModal(resortId);
        });

        document.addEventListener('click', async (event) => {
            const etaTarget = event.target.closest('[data-eta-action="get"]');
            if (!etaTarget) return;
            const resortId = etaTarget.dataset.resortId;
            if (!resortId) return;
            await requestResortEta(resortId);
        });


        const WORKER_URL = 'https://cloudflare-worker.rickt123-0f8.workers.dev/';
        const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 min
        const SENDIT_UI_REFRESH_INTERVAL = 12 * 1000; // keep CTA/cooldown state fresh without page reload
        let snapshotLastUpdatedIso = null;

        resorts.forEach(normalizeSnowfall);
        applyStaticMountainMetrics();
        applyResortApresFamilyScores();
        applyManualResortOverrides();
        applyResortPassMembership();
        applyResortGladeScores();
        applyResortDriveTimes();

        loadSendItUnlockState();
        loadSendItCooldownState();
        applySendItTestUnlocks();
        renderResorts();

        setInterval(() => {
            const hasCooldownState = Object.keys(sendItCooldownUntilByResort || {}).length > 0;
            const hasPostVoteState = Object.values(sendItPostVoteAwaitByResort || {}).some(Boolean);
            if (hasCooldownState || hasPostVoteState) {
                renderResorts();
            }
        }, SENDIT_UI_REFRESH_INTERVAL);

        document.addEventListener('click', async (event) => {
            const target = event.target.closest('[data-sendit-action]');
            if (!target) return;

            const action = target.dataset.senditAction;
            const resortId = target.dataset.resortId;
            if (!resortId) return;

            if (action === 'unlock') {
                target.classList.add('rail-slam');
                if (navigator.vibrate) {
                    navigator.vibrate([50, 30, 50, 20, 30]);
                }
                setTimeout(() => target.classList.remove('rail-slam'), 600);
                await unlockSendItForResort(resortId, target);
                return;
            }

            if (action === 'restart-signal') {
                const cooldownRemaining = getSendItCooldownRemainingMinutes(resortId);
                if (cooldownRemaining > 0) {
                    alert(getSendItCooldownMessage(cooldownRemaining));
                    return;
                }
                clearSendItLocalCooldown(resortId);
                sendItPostVoteAwaitByResort[resortId] = false;
                sendItSignalSelectionByResort[resortId] = {
                    crowd: null,
                    wind: null,
                    slope: null,
                    hazard: null,
                    difficulty: '',
                    activeGroup: SENDIT_GROUP_ORDER[0]
                };
                sendItReadySlamByResort[resortId] = false;
                renderResorts();
                return;
            }

            const requiresVerifiedLocation = action === 'select-difficulty'
                || action === 'select-group'
                || action === 'select-option'
                || action === 'select-crowd'
                || action === 'select-wind'
                || action === 'vote'
                || action === 'vote-radial';
            if (requiresVerifiedLocation && !sendItUnlockedResorts.has(resortId)) {
                showSendItToast('Verify first', 'Tap I\'M HERE! to unlock local voting.');
                return;
            }

            if (action === 'select-crowd') {
                const crowd = target.dataset.value;
                setSendItSignalSelection(resortId, 'crowd', crowd);
                renderResorts();
                return;
            }

            if (action === 'select-wind') {
                const wind = target.dataset.value;
                setSendItSignalSelection(resortId, 'wind', wind);
                renderResorts();
                return;
            }

            if (action === 'select-difficulty') {
                const difficulty = target.dataset.value;
                setSendItSignalSelection(resortId, 'difficulty', difficulty);
                const current = getSendItSignalSelection(resortId);
                current.wind = null;
                current.crowd = null;
                current.hazard = null;
                current.slope = null;
                current.activeGroup = SENDIT_GROUP_ORDER[0];
                sendItSignalSelectionByResort[resortId] = { ...current };
                sendItReadySlamByResort[resortId] = false;
                renderResorts();
                return;
            }

            if (action === 'select-group') {
                const group = target.dataset.group;
                if (!SENDIT_GROUP_ORDER.includes(group)) return;
                const current = getSendItSignalSelection(resortId);
                sendItSignalSelectionByResort[resortId] = { ...current, activeGroup: group };
                renderResorts();
                return;
            }

            if (action === 'select-option') {
                const group = target.dataset.group;
                const value = target.dataset.value;
                if (!SENDIT_GROUP_ORDER.includes(group)) return;
                const before = getSendItSignalSelection(resortId);
                const wasReady = canSubmitSendItSelection(before);
                setSendItSignalSelection(resortId, group, value);
                const current = getSendItSignalSelection(resortId);
                const nextGroup = getNextSendItGroup(current) || '';
                sendItSignalSelectionByResort[resortId] = { ...current, activeGroup: nextGroup };
                const isReady = canSubmitSendItSelection(current);
                sendItReadySlamByResort[resortId] = !wasReady && isReady;
                renderResorts();
                return;
            }

            if (action === 'vote') {
                const score = Number(target.dataset.score);
                const signalSelection = getSendItSignalSelection(resortId);
                await submitSendItVote(resortId, score, signalSelection, target);
                return;
            }

            if (action === 'vote-radial') {
                const signalSelection = getSendItSignalSelection(resortId);
                if (!canSubmitSendItSelection(signalSelection)) {
                    showSendItToast('Finish your loadout', 'Pick difficulty + wind + crowd + hazard + snow');
                    return;
                }
                target.classList.add('rail-slam');
                triggerHaptic([14, 24, 12]);
                setTimeout(() => target.classList.remove('rail-slam'), 560);
                const score = getSendItScoreFromSelection(signalSelection);
                await submitSendItVote(resortId, score, signalSelection, target);
            }
        });

        async function loadLiveData() {
            try {
                const resp = await fetch(WORKER_URL, {
                    cache: 'no-store',
                    headers: { 'Cache-Control': 'no-cache' }
                });

                if (!resp.ok) throw new Error(`Worker returned ${resp.status}`);

                const result = await resp.json();
                if (result.error || result.fallback) throw new Error(result.error || 'Worker returned fallback');

                const apiData = (result && typeof result === 'object')
                    ? (result.data && typeof result.data === 'object' ? result.data : result)
                    : {};
                if (result && typeof result === 'object') {
                    snapshotLastUpdatedIso =
                        result?.snapshot?.lastUpdated
                        || result?.data?._metadata?.lastUpdated
                        || snapshotLastUpdatedIso;
                    if (result.senditSummary && typeof result.senditSummary === 'object') {
                        sendItSummaryByResort = result.senditSummary;
                    }
                    if (result.senditConfig && typeof result.senditConfig === 'object') {
                        if (typeof result.senditConfig.defaultRadiusMiles === 'number') {
                            sendItRadiusMiles = result.senditConfig.defaultRadiusMiles;
                        } else if (typeof result.senditConfig.radiusMiles === 'number') {
                            sendItRadiusMiles = result.senditConfig.radiusMiles;
                        }
                        if (result.senditConfig.resortRadiusMiles && typeof result.senditConfig.resortRadiusMiles === 'object') {
                            sendItRadiusOverrides = result.senditConfig.resortRadiusMiles;
                        }
                        if (typeof result.senditConfig.maxAccuracyMeters === 'number') {
                            sendItMaxAccuracyMeters = result.senditConfig.maxAccuracyMeters;
                        }
                        if (typeof result.senditConfig.cooldownMinutes === 'number') {
                            sendItCooldownMinutes = Math.max(1, result.senditConfig.cooldownMinutes);
                        }
                        if (result.senditConfig.resortCooldownMinutes && typeof result.senditConfig.resortCooldownMinutes === 'object') {
                            sendItCooldownOverrides = result.senditConfig.resortCooldownMinutes;
                        }
                    }
                }
                let weatherUpdatedCount = 0;
                let liftUpdatedCount = 0;
                resorts.forEach((resort) => {
                    resort.hasLiveUpdate = false;
                    resort.hasLiveWeather = false;
                    resort.hasLiveLifts = false;
                });

                resorts.forEach(resort => {
                    const live = apiData[resort.id];
                    if (!live) return;

                    if (live.weather) {
                        const temp = typeof live.weather.temp === 'number' ? live.weather.temp : null;
                        const feelsLike = typeof live.weather.feelsLike === 'number' ? live.weather.feelsLike : null;
                        resort.weather = {
                            temp,
                            tempF: temp !== null ? `${temp}°` : '—',
                            feelsLike,
                            feelsLikeF: feelsLike !== null ? `${feelsLike}°` : '—',
                            wind: live.weather.wind,
                            windGust: live.weather.windGust || null,
                            condition: live.weather.condition,
                            icon: live.weather.icon
                        };
                        weatherUpdatedCount++;
                        resort.hasLiveUpdate = true;
                        resort.hasLiveWeather = true;
                    }

                    if (live.forecast && live.forecast.length >= 3) {
                        resort.forecast = live.forecast.slice(0, 3).map(day => {
                            const dayTemp = typeof day.temp === 'number' ? day.temp : null;
                            const daySnow = typeof day.snow === 'number' ? day.snow : day.snow;
                            return {
                                ...day,
                                temp: dayTemp,
                                tempF: day.tempF ?? (dayTemp !== null ? `${dayTemp}°` : '—'),
                                snow: daySnow
                            };
                        });
                    }

                    if (live.powWatch && typeof live.powWatch === 'object') {
                        const totals = live.powWatch.totals || {};
                        const hourly = live.powWatch.hourly || {};
                        const windHoldRisk = live.powWatch.windHoldRisk || {};
                        const alert = live.powWatch.alert || {};
                        const snowLevel = live.powWatch.snowLevel || {};
                        const toNumOrNull = (v) => {
                            const n = Number(v);
                            return Number.isFinite(n) ? n : null;
                        };
                        resort.powWatch = {
                            provider: typeof live.powWatch.provider === 'string' ? live.powWatch.provider : null,
                            source: typeof live.powWatch.source === 'string' ? live.powWatch.source : null,
                            overrideNote: typeof live.powWatch.overrideNote === 'string' ? live.powWatch.overrideNote : null,
                            updatedAt: typeof live.powWatch.updatedAt === 'string' ? live.powWatch.updatedAt : null,
                            band: typeof live.powWatch.band === 'string' ? live.powWatch.band : '',
                            statusLabel: typeof live.powWatch.statusLabel === 'string' ? live.powWatch.statusLabel : null,
                            nwsAvailable: Boolean(live.powWatch.nwsAvailable),
                            modelSpread72: toNumOrNull(live.powWatch.modelSpread72),
                            modelSources: Array.isArray(live.powWatch.modelSources) ? live.powWatch.modelSources.slice(0, 3) : [],
                            powBrief: typeof live.powWatch.powBrief === 'string' ? live.powWatch.powBrief : null,
                            powBriefSource: typeof live.powWatch.powBriefSource === 'string' ? live.powWatch.powBriefSource : null,
                            powBriefUpdatedAt: typeof live.powWatch.powBriefUpdatedAt === 'string' ? live.powWatch.powBriefUpdatedAt : null,
                            hourlySourceMix: (live.powWatch.hourlySourceMix && typeof live.powWatch.hourlySourceMix === 'object')
                                ? {
                                    nws: toNumOrNull(live.powWatch.hourlySourceMix.nws) ?? 0,
                                    vc: toNumOrNull(live.powWatch.hourlySourceMix.vc) ?? 0,
                                    vc_inferred: toNumOrNull(live.powWatch.hourlySourceMix.vc_inferred) ?? 0,
                                    none: toNumOrNull(live.powWatch.hourlySourceMix.none) ?? 0,
                                }
                                : { nws: 0, vc: 0, vc_inferred: 0, none: 0 },
                            days: Array.isArray(live.powWatch.days) ? live.powWatch.days.slice(0, 3) : [],
                            totals: {
                                snow24: toNumOrNull(totals.snow24),
                                snow48: toNumOrNull(totals.snow48),
                                snow72: toNumOrNull(totals.snow72),
                                snow24Low: toNumOrNull(totals.snow24Low),
                                snow24High: toNumOrNull(totals.snow24High),
                                snow48Low: toNumOrNull(totals.snow48Low),
                                snow48High: toNumOrNull(totals.snow48High),
                                snow72Low: toNumOrNull(totals.snow72Low),
                                snow72High: toNumOrNull(totals.snow72High),
                                stormTotal: toNumOrNull(totals.stormTotal),
                                stormTotalHigh: toNumOrNull(totals.stormTotalHigh),
                            },
                            hourly: {
                                snowSeries24: Array.isArray(hourly.snowSeries24) ? hourly.snowSeries24.slice(0, 24).map(toNumOrNull).filter((v) => v !== null) : [],
                                snowSeries48: Array.isArray(hourly.snowSeries48) ? hourly.snowSeries48.slice(0, 48).map(toNumOrNull).filter((v) => v !== null) : [],
                                snowSeries72: Array.isArray(hourly.snowSeries72) ? hourly.snowSeries72.slice(0, 72).map(toNumOrNull).filter((v) => v !== null) : [],
                                peakTs: typeof hourly.peakTs === 'string' ? hourly.peakTs : null,
                                peakLabel: typeof hourly.peakLabel === 'string' ? hourly.peakLabel : null,
                                peakSnowPerHour: toNumOrNull(hourly.peakSnowPerHour),
                                stormStartTs: typeof hourly.stormStartTs === 'string' ? hourly.stormStartTs : null,
                                stormEndTs: typeof hourly.stormEndTs === 'string' ? hourly.stormEndTs : null,
                            },
                            windHoldRisk: {
                                level: typeof windHoldRisk.level === 'string' ? windHoldRisk.level : 'LOW',
                                maxGustMph: toNumOrNull(windHoldRisk.maxGustMph),
                            },
                            alert: {
                                active: Boolean(alert.active),
                                event: typeof alert.event === 'string' ? alert.event : null,
                                expires: typeof alert.expires === 'string' ? alert.expires : null,
                                headline: typeof alert.headline === 'string' ? alert.headline : null,
                                severity: typeof alert.severity === 'string' ? alert.severity : null,
                            },
                            snowLevel: {
                                current: toNumOrNull(snowLevel.current),
                                trend: typeof snowLevel.trend === 'string' ? snowLevel.trend : null,
                                updatedAt: typeof snowLevel.updatedAt === 'string' ? snowLevel.updatedAt : null,
                                rainPossibleAtBase: Boolean(snowLevel.rainPossibleAtBase),
                                baseElevationFt: toNumOrNull(snowLevel.baseElevationFt),
                            },
                        };
                    }

                    if (live.lifts) {
                        if (!resort.lifts || typeof resort.lifts !== 'object') {
                            resort.lifts = {};
                        }
                        resort.lifts.open = live.lifts.open;
                        resort.lifts.total = live.lifts.total;
                        resort.lifts.closed = live.lifts.total - live.lifts.open;
                        resort.hasLiftie = true;
                        liftUpdatedCount++;
                        resort.hasLiveUpdate = true;
                        resort.hasLiveLifts = true;

                        if (live.lifts.details) {
                            resort.liftDetails = live.lifts.details;
                        }

                    }
                });

                resorts.forEach(resort => {
                    if (Number.isFinite(Number(resort.manualRating))) {
                        resort.rating = Math.max(1, Math.min(5, Number(resort.manualRating)));
                    } else {
                        resort.rating = calculateRating(resort.weather, resort.snowfall);
                    }
                });

                renderResorts();
                showDataStatus('fresh', null, weatherUpdatedCount, liftUpdatedCount);

            } catch (error) {
                console.error('❌ Failed to load live data:', error);
                showDataStatus('error', null, 0, 0, error.message);
            }
        }

        function showDataStatus(status, timestamp, weatherCount, liftCount, errorMsg) {
            const existing = document.getElementById('data-status');
            if (existing) existing.remove();

            const statusDiv = document.createElement('div');
            statusDiv.id = 'data-status';
            statusDiv.style.cssText = `
                position: fixed; bottom: 20px; left: 20px;
                padding: 0.75rem 1rem; border-radius: 8px;
                font-size: 0.75rem; font-weight: 600;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999; display: flex; align-items: center; gap: 0.5rem;
                backdrop-filter: blur(10px);
            `;

            if (status === 'fresh') {
                statusDiv.style.background = 'rgba(0, 166, 153, 0.95)';
                statusDiv.style.color = 'white';
                const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                const totalResorts = resorts.length;
                const manualLiftCount = Math.max(0, totalResorts - liftCount);
                statusDiv.innerHTML = `
                    <span style="font-size: 1.2rem;">✓</span>
                    <div style="line-height: 1.4;">
                        <div>Live data • ${time}</div>
                        <div style="font-size: 0.65rem; opacity: 0.9;">Weather: ${weatherCount}/${totalResorts} • Lifts: ${liftCount} live + ${manualLiftCount} patrol-updated (${totalResorts} total)</div>
                    </div>
                `;
                setTimeout(() => statusDiv.remove(), 6000);
            } else if (status === 'error') {
                statusDiv.style.background = 'rgba(255, 90, 95, 0.95)';
                statusDiv.style.color = 'white';
                statusDiv.innerHTML = `<span style="font-size: 1.2rem;">⚠️</span><span>APIs connecting • Using defaults</span>`;
                setTimeout(() => statusDiv.remove(), 10000);
            }
            document.body.appendChild(statusDiv);
        }

        loadLiveData().catch(err => console.warn('Initial load failed:', err));
        setInterval(loadLiveData, REFRESH_INTERVAL);

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px', // Trigger when bubble enters middle 60% of viewport
                threshold: [0, 0.1, 0.5, 0.9, 1]
            };

            const bubbleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const bubble = entry.target;

                    if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                        bubble.classList.add('mobile-active');
                    } else {
                        bubble.classList.remove('mobile-active');
                    }
                });
            }, observerOptions);

            const observeRatingBubbles = () => {
                document.querySelectorAll('.rating-text').forEach(bubble => {
                    if (!bubble.hasAttribute('data-observed')) {
                        bubble.setAttribute('data-observed', 'true');
                        bubbleObserver.observe(bubble);
                    }
                });
            };

            setTimeout(observeRatingBubbles, 100);

            const resortGrid = document.getElementById('resortGrid');
            if (resortGrid) {
                const gridObserver = new MutationObserver(() => {
                    observeRatingBubbles();
                });

                gridObserver.observe(resortGrid, {
                    childList: true,
                    subtree: true
                });
            }
        }

        const backToTopBtn = document.getElementById('backToTop');

        if (backToTopBtn) {
            function toggleBackToTop() {
                const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                if (scrolled > 500) { // Show after scrolling 500px
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }

            window.addEventListener('scroll', toggleBackToTop);

            toggleBackToTop();

            backToTopBtn.addEventListener('click', function() {
                if (this.classList.contains('launching')) return;

                this.classList.add('launching');

                if (navigator.vibrate) {
                    navigator.vibrate([40, 30, 40, 30, 40]);
                }

                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 1700);

                setTimeout(() => {
                    this.classList.remove('launching');

                    const beforeEl = window.getComputedStyle(this, '::before');
                    const afterEl = window.getComputedStyle(this, '::after');
                    void beforeEl.transform; // Force reflow
                    void afterEl.transform;
                }, 3900); // Match gondola ascent duration
            });

            const keepTipsUpLink = document.getElementById('keepTipsUpLink');
            if (keepTipsUpLink) {
                keepTipsUpLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    backToTopBtn.click();
                });
            }
        } else {
            console.error('❌ Back to top button not found!');
        }
