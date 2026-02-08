        // SVG Icon templates (Airbnb-style minimalist)
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
            car: `<svg class="icon-ticket" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <circle cx="17" cy="17" r="2"/>
            </svg>`,
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
            const isCanada = resort.region === "canada";

            // Condition flags
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

        // Calculate IceCoast rating dynamically from live weather + manual snow data
        // Weights: 40% Snow, 20% Temp, 20% Wind, 20% Conditions
        function calculateRating(weather, snowfall) {
            // Fallbacks when live data is missing
            const safeWeather = weather || {};
            const safeSnowfall = snowfall || {};

            let score = 0;

            // 1. SNOW – use 24h/48h from snowfall object if present
            const snow24h = parseInt(safeSnowfall.snowfall24h ?? safeSnowfall['24h'] ?? 0, 10);
            const snow48h = parseInt(safeSnowfall.snowfall48h ?? safeSnowfall['48h'] ?? 0, 10);
            let snowScore = 0;
            if (snow24h >= 6) snowScore = 5;
            else if (snow24h >= 4) snowScore = 4;
            else if (snow24h >= 2) snowScore = 3;
            else if (snow24h >= 1) snowScore = 2;
            else snowScore = snow48h > 0 ? 2 : 1;
            score += snowScore * 0.4;

            // 2. TEMPERATURE – guard weather.temp
            const temp = typeof safeWeather.temp === 'number' ? safeWeather.temp : 25; // neutral default
            let tempScore = 0;
            if (temp >= 15 && temp <= 30) tempScore = 5;
            else if ((temp >= 10 && temp < 15) || (temp > 30 && temp <= 35)) tempScore = 4;
            else if ((temp >= 5 && temp < 10) || (temp > 35 && temp <= 40)) tempScore = 3;
            else if ((temp >= 0 && temp < 5) || (temp > 40 && temp <= 45)) tempScore = 2;
            else tempScore = 1;
            score += tempScore * 0.2;

            // 3. WIND – guard weather.wind
            const windSpeed = parseInt(safeWeather.wind ?? 0, 10);
            let windScore = 0;
            if (windSpeed <= 10) windScore = 5;
            else if (windSpeed <= 15) windScore = 4;
            else if (windSpeed <= 20) windScore = 3;
            else if (windSpeed <= 30) windScore = 2;
            else windScore = 1;
            score += windScore * 0.2;

            // 4. CONDITIONS – guard weather.condition
            const condition = (safeWeather.condition || '').toLowerCase();
            let conditionScore = 3;
            if (condition.includes('snow')) conditionScore = 5;
            else if (condition.includes('clear') || condition.includes('sun')) conditionScore = 4;
            else if (condition.includes('cloud')) conditionScore = 3;
            else if (condition.includes('rain') || condition.includes('drizzle')) conditionScore = 1;
            score += conditionScore * 0.2;

            // Round to 1–5
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

        function applyManualResortOverrides() {
            const overrides =
                (typeof window !== 'undefined' && (window.MANUAL_RESORT_OVERRIDES || window.ICECOAST_MANUAL_OVERRIDES))
                || {};
            if (!overrides || typeof overrides !== 'object') return;

            resorts.forEach((resort) => {
                const patch = overrides[resort.id];
                if (!patch || typeof patch !== 'object') return;

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
            // Epic
            'hunter': ['epic'],
            'mount-snow': ['epic'],
            'okemo': ['epic'],
            'stowe': ['epic'],

            // Ikon
            'stratton': ['ikon'],
            'killington': ['ikon'],
            'pico': ['ikon'],
            'sugarbush': ['ikon'],
            'loon': ['ikon'],
            'sunday-river': ['ikon'],
            'sugarloaf': ['ikon'],
            'tremblant': ['ikon'],

            // Windham is no longer Ikon
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

        // Static glade score: 3 = best glades, 2 = decent glades, 1 = some glades
        const RESORT_GLADE_SCORE = {
            // Poconos / PA
            'camelback': 1,
            'blue-mountain': 1,
            'jack-frost': 0,
            'shawnee': 1,
            'bear-creek': 0,
            'elk': 1,
            'big-boulder': 0,
            'montage': 1,

            // NY
            'hunter': 2,
            'windham': 2,
            'belleayre': 2,
            'whiteface': 3,
            'gore-mountain': 2,

            // MA / CT
            'jiminy-peak': 1,
            'wachusett': 0,
            'mohawk': 1,

            // Vermont
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

            // NH / ME
            'loon': 2,
            'brettonwoods': 2,
            'waterville': 2,
            'cannon': 2,
            'wildcat': 3,
            'sunday-river': 2,
            'sugarloaf': 3,
            'saddleback': 3,

            // Canada
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

        const DEFAULT_SEND_IT_RADIUS_MILES = 1.5;
        let sendItSummaryByResort = {};
        let sendItRadiusMiles = DEFAULT_SEND_IT_RADIUS_MILES;
        let sendItRadiusOverrides = {};
        let sendItMaxAccuracyMeters = 200;
        const SENDIT_DEVICE_ID_KEY = 'icecoast_sendit_device_id';
        const sendItUnlockedResorts = new Set();
        const sendItButtonCopyByResort = {};

        const SENDIT_LOW_OPTIONS = [
            'Yard Sale',
            'Core Shot Day',
            'Lap And Laugh',
            'Edge Tune Energy',
            'Sharpen Your Edges',
            'Steel Edges Today',
            'Boilerplate Ballet',
            'Firm And Fast'
        ];

        const SENDIT_MID_OPTIONS = [
            'Type 2 Fun',
            'Soft Send',
            'Send-ish',
            'Firm But Fun',
            'Edge It Out',
            'Still Worth It',
            'Mid Stoke',
            'Ski It Anyway'
        ];

        const SENDIT_HIGH_OPTIONS = [
            'Full Send',
            'Drop In',
            'All Gas',
            'Top To Bottom',
            'No Friends Day',
            'Laps On Laps',
            'Nuking Vibes',
            'Ride Till Last Chair',
            'Hammer Laps',
            'Legends Only',
            'Point Em Downhill',
            'Send Train',
            'Straight Filth',
            'Air It Out',
            'Maximum Stoke',
            'Zero Hesitation'
        ];
        const SENDIT_COOLDOWN_OPTIONS = [
            'Easy, legend. Patrol says wait {minutes}m before your next call.',
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

        function pickRandomLabel(options) {
            return options[Math.floor(Math.random() * options.length)];
        }

        function getSendItButtonCopy(resortId) {
            if (!sendItButtonCopyByResort[resortId]) {
                sendItButtonCopyByResort[resortId] = {
                    low: pickRandomLabel(SENDIT_LOW_OPTIONS),
                    mid: pickRandomLabel(SENDIT_MID_OPTIONS),
                    high: pickRandomLabel(SENDIT_HIGH_OPTIONS)
                };
            }
            return sendItButtonCopyByResort[resortId];
        }

        function getSendItCooldownMessage(retryAfterMinutes) {
            const minutes = Math.max(1, Math.round(Number(retryAfterMinutes) || 1));
            const template = pickRandomLabel(SENDIT_COOLDOWN_OPTIONS);
            return template.replace('{minutes}', `${minutes}`);
        }

        function loadSendItUnlockState() {
            try {
                const raw = localStorage.getItem('icecoast_sendit_unlocked');
                if (!raw) return;
                const ids = JSON.parse(raw);
                if (Array.isArray(ids)) {
                    ids.forEach(id => sendItUnlockedResorts.add(id));
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

        function getSendItState(scoreValue) {
            if (!Number.isFinite(scoreValue)) {
                return { label: 'First Chair', className: '' };
            }
            if (scoreValue >= 70) {
                return { label: 'Full Send', className: 'hot' };
            }
            if (scoreValue >= 45) {
                return { label: 'Could Be Worse', className: 'mid' };
            }
            return { label: 'Sharpen Edges', className: 'cold' };
        }

        function getSendItSocialLine(votesLastHour, votesTotal) {
            if (votesLastHour > 0) {
                return `${votesLastHour} local${votesLastHour === 1 ? '' : 's'} voted in the last hour`;
            }
            if (votesTotal > 0) {
                return `No fresh votes in the last hour • ${votesTotal} total`;
            }
            return 'Be the first local to call it';
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
                // Ignore haptics failures silently.
            }
        }

        async function unlockSendItForResort(resortId, buttonEl) {
            const resortCoords = getResortCoords(resortId);
            if (!resortCoords) {
                alert('This resort is missing coordinates, so Send It voting is unavailable.');
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
                    alert(`You are ${distance.toFixed(1)} miles away. Send It voting unlocks within ${formatMiles(requiredMiles)} miles.`);
                    return;
                }

                sendItUnlockedResorts.add(resortId);
                persistSendItUnlockState();
                triggerHaptic([12, 24, 12]);
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

        async function submitSendItVote(resortId, score, buttonEl) {
            const resortCoords = getResortCoords(resortId);
            if (!resortCoords) {
                alert('This resort is missing coordinates, so Send It voting is unavailable.');
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
                const pos = await getBrowserLocation();
                const deviceId = getSendItDeviceId();
                const voteUrl = new URL('sendit/vote', WORKER_URL).toString();
                const resp = await fetch(voteUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        resortId,
                        score,
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
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

                renderResorts();
            } catch (e) {
                triggerHaptic([24, 34, 24]);
                if (e?.code === 'SENDIT_COOLDOWN') {
                    alert(getSendItCooldownMessage(e.retryAfterMinutes));
                    return;
                }
                alert(e.message || 'Unable to submit vote right now.');
            } finally {
                if (buttonEl) {
                    buttonEl.disabled = false;
                    buttonEl.classList.remove('is-submitting');
                    buttonEl.textContent = originalText;
                }
            }
        }

        function createResortCard(resort) {
            // ── Safe fallbacks for nested data ──
            const vertical = resort.elevation?.vertical ?? '—';
            const trailsOpen = resort.trails?.open ?? '—';
            const trailsClosed = resort.trails?.closed ?? '—';
            const liftsOpen = resort.lifts?.open ?? '—';
            const liftsClosed = resort.lifts?.closed ?? '—';

            const park = resort.park ?? 0;
            const glades = resort.glades ?? 0;
            const apres = resort.apres ?? 0;
            const family = resort.family ?? 0;

            const passes = resort.passes || [];
            const distance = resort.distance || {};
            const weather = resort.weather || {};
            const forecast = resort.forecast || [];

            const stars = Array.from({ length: 5 }, (_, i) => {
                const isFilled = i < (resort.rating || 0);
                return `<span class="star ${isFilled ? 'filled' : 'empty'}">★</span>`;
            }).join('');

            const sendIt = sendItSummaryByResort[resort.id] || {};
            const sendItButtonCopy = getSendItButtonCopy(resort.id);
            const requiredMiles = getSendItRadiusMilesForResort(resort.id);
            const sendItVotes = Number.isFinite(sendIt.votes) ? sendIt.votes : 0;
            const sendItVotesLastHour = Number.isFinite(sendIt.votesLastHour) ? sendIt.votesLastHour : 0;
            const sendItScoreValue = Number.isFinite(sendIt.score) ? sendIt.score : null;
            const sendItScoreClass = sendItScoreValue === null
                ? ''
                : (sendItScoreValue >= 70 ? 'hot' : (sendItScoreValue >= 45 ? 'mid' : 'cold'));
            const sendItState = getSendItState(sendItScoreValue);
            const sendItVotesText = `${sendItVotes} vote${sendItVotes === 1 ? '' : 's'}`;
            const sendItScoreRounded = Number.isFinite(sendItScoreValue)
                ? Math.round(sendItScoreValue)
                : null;
            const sendItScoreMarkup = sendItScoreRounded === null
                ? '<span class="sendit-score-empty">—</span>'
                : `<span class="sendit-score-number">${sendItScoreRounded}</span><span class="sendit-score-unit">%</span>`;
            const sendItSocialLine = getSendItSocialLine(sendItVotesLastHour, sendItVotes);
            const hasCoords = typeof resort.lat === 'number' && typeof resort.lon === 'number';
            const canVote = hasCoords && sendItUnlockedResorts.has(resort.id);
            const sendItSubtitle = 'Locals on-mountain only';
            const sendItPrompt = canVote ? `<div class="sendit-prompt">Tap your call</div>` : '';
            const sendItControls = !hasCoords
                ? `<div class="sendit-locked-note">Coordinates missing for this resort.</div>`
                : canVote
                    ? `<div class="sendit-vote-row">
                        <button class="sendit-vote-btn" data-sendit-action="vote" data-resort-id="${resort.id}" data-score="20">${sendItButtonCopy.low}</button>
                        <button class="sendit-vote-btn" data-sendit-action="vote" data-resort-id="${resort.id}" data-score="60">${sendItButtonCopy.mid}</button>
                        <button class="sendit-vote-btn" data-sendit-action="vote" data-resort-id="${resort.id}" data-score="100">${sendItButtonCopy.high}</button>
                      </div>
                      <div class="sendit-locked-note">Verified nearby. Local-only voting (${formatMiles(requiredMiles)} mi geofence).</div>`
                    : `<button class="sendit-unlock-btn" data-sendit-action="unlock" data-resort-id="${resort.id}">Unlock Nearby Voting</button>
                       <div class="sendit-locked-note">Only users within ${formatMiles(requiredMiles)} miles can vote.</div>`;

            // POWDER / FRESH badges safely
            const isPowder = resort.conditions === 'Powder';
            const isPackedPowder = resort.conditions === 'Packed Powder';
            const hasSignificantSnow = parseInt(resort.snowfall24h || '0', 10) >= 6;
            let snowBadge = '';
            if (isPowder || isPackedPowder || hasSignificantSnow) {
                const label = isPowder
                    ? 'POWDER DAY'
                    : isPackedPowder
                    ? 'PACKED POWDER'
                    : 'FRESH POW';
                snowBadge = `<div class="snow-alert-badge">${resort.snowfall24h || 0}″ ${label}</div>`;
            }

            // Icon handling
            // Resort emoji/icons removed from card header by request.
            const iconMarkup = '';

            // Explicit resort -> image mapping using available files in /v2/resorts.
            // Filenames in that folder use legacy stems (e.g. blue, jackfrost, sundayriver).
            const backgroundImageByResort = {
                // Pennsylvania
                'camelback': 'camelback',
                'blue-mountain': 'blue',
                'jack-frost': 'jackfrost',
                'shawnee': 'shawnee',
                'bear-creek': 'bearcreek',
                'elk': 'elk',
                'big-boulder': 'bigboulder',
                'montage': 'montage',
                // New York
                'hunter': 'hunter',
                'windham': 'windham',
                'belleayre': 'belleayre',
                'whiteface': 'wildcat',
                'gore-mountain': 'cannon',
                // Massachusetts & Connecticut
                'jiminy-peak': 'stratton',
                'wachusett': 'waterville',
                'mohawk': 'shawnee',
                // Vermont
                'stratton': 'stratton',
                'mount-snow': 'stratton',
                'killington': 'killington',
                'okemo': 'okemo',
                'pico': 'killington',
                'sugarbush': 'sugarbush',
                'mad-river-glen': 'sugarbush',
                'stowe': 'stowe',
                'smugglers-notch': 'stowe',
                'jay-peak': 'wildcat',
                'burke': 'wildcat',
                // New Hampshire & Maine
                'loon': 'loon',
                'brettonwoods': 'waterville',
                'waterville': 'waterville',
                'cannon': 'cannon',
                'wildcat': 'wildcat',
                'sunday-river': 'sundayriver',
                'sugarloaf': 'sundayriver',
                'saddleback': 'sundayriver',
                // Canada
                'tremblant': 'stowe',
                'mont-sainte-anne': 'sundayriver',
                'le-massif': 'wildcat',
                'mont-sutton': 'sugarbush'
            };

            const backgroundImage = backgroundImageByResort[resort.id] || 'killington';

            // Fine-tuned focal points so peaks/bases are framed better per resort.
            const backgroundPositionByResort = {
                'camelback': 'center 38%',
                'blue-mountain': 'center 46%',
                'jack-frost': 'center 52%',
                'shawnee': 'center 50%',
                'bear-creek': 'center 54%',
                'elk': 'center 44%',
                'big-boulder': 'center 55%',
                'montage': 'center 48%',
                'hunter': 'center 34%',
                'windham': 'center 40%',
                'belleayre': 'center 42%',
                'whiteface': 'center 26%',
                'gore-mountain': 'center 30%',
                'jiminy-peak': 'center 45%',
                'wachusett': 'center 52%',
                'mohawk': 'center 52%',
                'stratton': 'center 43%',
                'mount-snow': 'center 41%',
                'killington': 'center 38%',
                'okemo': 'center 44%',
                'pico': 'center 40%',
                'sugarbush': 'center 33%',
                'mad-river-glen': 'center 34%',
                'stowe': 'center 30%',
                'smugglers-notch': 'center 31%',
                'jay-peak': 'center 28%',
                'burke': 'center 32%',
                'loon': 'center 42%',
                'brettonwoods': 'center 40%',
                'waterville': 'center 44%',
                'cannon': 'center 36%',
                'wildcat': 'center 27%',
                'sunday-river': 'center 40%',
                'sugarloaf': 'center 34%',
                'saddleback': 'center 35%',
                'tremblant': 'center 34%',
                'mont-sainte-anne': 'center 39%',
                'le-massif': 'center 30%',
                'mont-sutton': 'center 38%'
            };

            // Keep a slight zoom to hide white borders in source art without heavy pixelation.
            const backgroundSizeByResort = {
                'whiteface': '112%',
                'gore-mountain': '112%',
                'stowe': '112%',
                'wildcat': '112%',
                'jay-peak': '112%',
                'sugarbush': '110%',
                'sugarloaf': '110%',
                'le-massif': '112%'
            };

            const backgroundPos = backgroundPositionByResort[resort.id] || 'center 42%';
            const backgroundSize = backgroundSizeByResort[resort.id] || '106%';

            return `
            <div class="resort-card" data-region="${resort.region}" data-resort="${resort.id}">
              <div class="resort-header" style="--bg: url('resorts/${backgroundImage}-1280.avif'); --bg-pos: ${backgroundPos}; --bg-size: ${backgroundSize};">
                ${resort.familyOwned ? `<div class="family-badge">Family-Owned</div>` : ''}
                <div style="display:flex;justify-content:space-between;align-items:flex-start;width:100%;">
                  <div style="flex:1;">
                    <h2 class="resort-name">
                      <span class="resort-name-text">${resort.name}</span>
                      ${resort.isScraped ? `<span class="live-data-badge"><span><span>LIVE</span></span></span>` : ''}
                    </h2>
                    <p class="resort-location">${resort.location}</p>
                    ${resort.glades > 0 ? `
                      <div class="glade-indicator">
                        <span class="glade-trees">${'🌲'.repeat(Math.min(glades, 3))}</span>
                        <span class="glade-label">
                          ${glades >= 3 ? 'Elite Glades' : glades === 2 ? 'Excellent Glades' : 'Some Glades'}
                        </span>
                      </div>` : ''}
                  </div>
                  ${iconMarkup}
                </div>
                ${snowBadge}
              </div>

              <div class="resort-body">
                <div class="rating-section">
                  <div>
                    <div class="rating-label icecoast-title">Icecoast Rating</div>
                    <div class="rating-stars">${stars}</div>
                  </div>
                  <div class="rating-text">
                    ${getRatingText(resort.rating, resort.snowfall24h, resort)}
                  </div>
                </div>

                <div class="sendit-section">
                  <div class="sendit-header">
                    <div class="sendit-title-wrap">
                      <div class="rating-label sendit-title">SEND IT METER</div>
                      <div class="sendit-subline">
                        <span class="sendit-live-dot"></span>
                        <span class="sendit-subtitle">${sendItSubtitle}</span>
                      </div>
                    </div>
                    <div class="sendit-scoreboard ${sendItState.className || sendItScoreClass}" style="--sendit-score:${sendItScoreValue === null ? 0 : Math.max(0, Math.min(100, Math.round(sendItScoreValue)))}" aria-label="Full Send score">
                      <span class="sendit-score-kicker">Full Send</span>
                      <div class="sendit-gauge" aria-hidden="true">
                        <span class="sendit-gauge-pointer"></span>
                      </div>
                      <span class="sendit-score-value">${sendItScoreMarkup}</span>
                    </div>
                  </div>
                  <div class="sendit-pulse ${sendItState.className || sendItScoreClass}">
                    <span class="sendit-pulse-label">Slope Signal</span>
                    <span class="sendit-state">${sendItState.label}</span>
                    <span class="sendit-votes">${sendItVotesText}</span>
                  </div>
                  <div class="sendit-social-proof">${sendItSocialLine}</div>
                  ${sendItPrompt}
                  ${sendItControls}
                </div>

                <div class="conditions-highlight">
                  <div class="conditions-label">Current Conditions</div>
                  <div class="conditions-value">${resort.conditions || 'Unknown'}</div>
                </div>

                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">
                      <span class="info-icon">${icons.ticket}</span>
                      Lift Ticket ${resort.dynamicPricing ? '<span class="dynamic-badge">Dynamic</span>' : ''}
                    </span>
                    <div style="display:flex;align-items:center;gap:0.5rem;">
                      <span class="info-value">
                        ${resort.liftTicket?.weekday ?? '—'}
                        ${resort.dynamicPricing ? '–' : ''}
                      </span>
                      ${resort.dynamicPricing && resort.liftTicket?.weekend
                          ? `<span class="info-value">${resort.liftTicket.weekend}</span>`
                          : ''}
                      ${passes.length
                          ? passes.map(pass =>
                              `<span class="pass-badge pass-${pass}">${pass === 'ikon' ? 'Ikon' : 'Epic'}</span>`
                            ).join('')
                          : ''}
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

                  <div class="info-item">
                    <span class="info-label">
                      <span class="info-icon">${icons.lift}</span>
                      Lifts
                    </span>
                    <div class="trail-status">
                      <span class="trail-badge open">${liftsOpen} Open</span>
                      <span class="trail-badge closed">${liftsClosed} Closed</span>
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
                      Lift Status
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

                <div class="weather-section">
                  <div class="weather-current">
                    <span class="weather-icon">${weather.icon || '☁️'}</span>
                    <div>
                      <div class="weather-temp">${weather.tempF ?? (typeof weather.temp === 'number' ? `${weather.temp}°` : '—')}</div>
                      <div class="weather-desc">${weather.condition || 'Unknown'}</div>
                    </div>
                  </div>
                  <div class="weather-details">
                    <div class="weather-detail-item">
                      <span class="info-icon">${icons.thermometer}</span>
                      <span class="weather-detail-label">Feels like</span>
                      <span class="weather-detail-value">${weather.feelsLikeF ?? (typeof weather.feelsLike === 'number' ? `${weather.feelsLike}°` : '—')}</span>
                    </div>
                    <div class="weather-detail-item">
                      <span class="info-icon">${icons.wind}</span>
                      <span class="weather-detail-label">Wind</span>
                      <span class="weather-detail-value">${weather.wind ?? '—'}</span>
                    </div>
                  </div>

                  <details class="forecast-details" style="margin-top:0.75rem;">
                    <summary class="forecast-toggle">
                      <span class="info-icon" style="display:inline-flex;vertical-align:middle;margin-right:0.5rem;">
                        ${icons.calendar}
                      </span>
                      3-Day Forecast
                    </summary>
                    <div class="forecast-grid">
                      ${forecast.map(day => `
                        <div class="forecast-day">
                          <div class="forecast-day-name">${day.day}</div>
                          <div class="forecast-icon">${day.icon}</div>
                          <div class="forecast-temp">${day.tempF ?? (typeof day.temp === 'number' ? `${day.temp}°` : '—')}</div>
                          <div class="forecast-snow">${typeof day.snow === 'number' ? `${day.snow}"` : (day.snow ?? '—')}</div>
                        </div>
                      `).join('')}
                    </div>
                  </details>
                </div>

                <div class="snow-report">
                  <div class="snow-stat">
                    <div class="snow-label">24h</div>
                    <div class="snow-value">${resort.snowfall24h ?? '—'}</div>
                  </div>
                  <div class="snow-stat">
                    <div class="snow-label">48h</div>
                    <div class="snow-value">${resort.snowfall48h ?? '—'}</div>
                  </div>
                  <div class="snow-stat">
                    <div class="snow-label">7d</div>
                    <div class="snow-value">${resort.snowfall7d ?? '—'}</div>
                  </div>
                </div>

                <div class="extra-ratings">
                  <div class="extra-rating-item">
                    <span class="extra-label">
                      <span class="info-icon" style="display:inline-flex;vertical-align:middle;margin-right:0.25rem;">
                        ${icons.apres}
                      </span>
                      Apres
                    </span>
                    <span class="extra-value">${'⭐'.repeat(Math.min(apres, 3))}</span>
                  </div>
                  <div class="extra-rating-item">
                    <span class="extra-label">
                      <span class="info-icon" style="display:inline-flex;vertical-align:middle;margin-right:0.25rem;">
                        ${icons.family}
                      </span>
                      Family
                    </span>
                    <span class="extra-value">${'⭐'.repeat(Math.min(family, 3))}</span>
                  </div>
                </div>

                <div class="distance-info">
                  <div class="distance-title">
                    <span class="info-icon" style="display:inline-flex;vertical-align:middle;margin-right:0.5rem;">
                      ${icons.car}
                    </span>
                    Drive Time
                  </div>
                  <div class="distance-list">
                    ${Object.entries(distance).map(([city, time]) => `
                      <div class="distance-item"><strong>${city}</strong> ${time}</div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;
        }


        // Filter state
        let filterState = {
            region: 'all',
            pass: 'all',
            vibe: 'all',
            sort: 'rating-high' // Start with best conditions
        };

        function applyFilters() {
            let filtered = [...resorts];

            // Region filter
            if (filterState.region !== 'all') {
                filtered = filtered.filter(r => r.region === filterState.region);
            }

            // Pass filter
            if (filterState.pass === 'ikon') {
                filtered = filtered.filter(r => r.passes && r.passes.includes('ikon'));
            } else if (filterState.pass === 'epic') {
                filtered = filtered.filter(r => r.passes && r.passes.includes('epic'));
            } else if (filterState.pass === 'none') {
                filtered = filtered.filter(r => !r.passes || r.passes.length === 0);
            }

            // Vibe filter (rating-based)
            if (filterState.vibe === 'sendit') {
                filtered = filtered.filter(r => r.rating >= 4);
            } else if (filterState.vibe === 'avoid') {
                filtered = filtered.filter(r => r.rating === 0); // Impossible - will always show no results
            }

            // Sorting
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
                case 'snow-7d':
                    filtered.sort((a, b) => {
                        const aSnow = (a.snowfall && a.snowfall['7d']) ? parseInt(a.snowfall['7d']) : 0;
                        const bSnow = (b.snowfall && b.snowfall['7d']) ? parseInt(b.snowfall['7d']) : 0;
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
                const messages = filterState.vibe === 'avoid' ? avoidMessages : snarkMessages;
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                grid.innerHTML = `<div class="loading" style="grid-column: 1/-1;">${randomMessage}</div>`;
                return;
            }

            grid.innerHTML = filtered.map(resort => createResortCard(resort)).join('');
        }

        // Region filter buttons
        document.querySelectorAll('[data-region]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-region]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterState.region = btn.dataset.region;
                renderResorts();
            });
        });
        // Legal accordion toggle
        function toggleLegal() {
            const accordion = document.getElementById('legalAccordion');
            const toggle = document.querySelector('.legal-toggle');

            accordion.classList.toggle('open');
            toggle.classList.toggle('active');
        }
        // Pass filter buttons
        document.querySelectorAll('[data-pass]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-pass]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterState.pass = btn.dataset.pass;
                renderResorts();
            });
        });

        // Vibe filter buttons
        document.querySelectorAll('[data-vibe]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-vibe]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterState.vibe = btn.dataset.vibe;
                renderResorts();
            });
        });

        // Sort dropdown
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            filterState.sort = e.target.value;
            renderResorts();
        });

        // Simple bar fill animation based on scroll
        function updateGauge() {
            const barFill = document.getElementById('barFill');
            if (!barFill) return;

            // Calculate scroll percentage
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const scrollPercent = Math.max(0, Math.min(scrollPosition / scrollHeight, 1));

            // Update bar width (0% to 100%)
            barFill.style.width = `${scrollPercent * 100}%`;
        }

        // Update on scroll (smooth and responsive)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateGauge();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial state
        setTimeout(updateGauge, 100);

        // ========================================
        // LIVE DATA: Liftie (Lifts) + OpenWeather (Weather)
        // ========================================
        //
        // DATA SOURCES:
        //   🌤️ Weather: OpenWeather API via Cloudflare Worker
        //   🚡 Lifts: Liftie API via Cloudflare Worker (22/28 resorts)
        //   ❄️ Snowfall: MANUAL updates
        //
        // Resorts NOT on Liftie: elk, bearcreek, jackfrost, bigboulder, montage, belleayre

        // Configuration - UPDATE THIS URL AFTER DEPLOYING YOUR WORKER
        const WORKER_URL = 'https://cloudflare-worker.rickt123-0f8.workers.dev/';
        const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 min

        resorts.forEach(normalizeSnowfall);
        applyManualResortOverrides();
        applyResortPassMembership();
        applyResortGladeScores();

        loadSendItUnlockState();
        renderResorts();

        document.addEventListener('click', async (event) => {
            const target = event.target.closest('[data-sendit-action]');
            if (!target) return;

            const action = target.dataset.senditAction;
            const resortId = target.dataset.resortId;
            if (!resortId) return;

            if (action === 'unlock') {
                await unlockSendItForResort(resortId, target);
                return;
            }

            if (action === 'vote') {
                const score = Number(target.dataset.score);
                await submitSendItVote(resortId, score, target);
            }
        });

        async function loadLiveData() {
            try {
                const resp = await fetch(WORKER_URL, {
                    headers: { 'Cache-Control': 'no-cache' }
                });

                if (!resp.ok) throw new Error(`Worker returned ${resp.status}`);

                const result = await resp.json();
                if (result.error || result.fallback) throw new Error(result.error || 'Worker returned fallback');

                const apiData = (result && typeof result === 'object')
                    ? (result.data && typeof result.data === 'object' ? result.data : result)
                    : {};
                if (result && typeof result === 'object') {
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
                    }
                }
                let weatherUpdatedCount = 0;
                let liftUpdatedCount = 0;

                resorts.forEach(resort => {
                    const live = apiData[resort.id];
                    if (!live) return;

                    // ── Weather (OpenWeather) ──
                    if (live.weather) {
                        const temp = typeof live.weather.temp === 'number' ? live.weather.temp : null;
                        const feelsLike = typeof live.weather.feelsLike === 'number' ? live.weather.feelsLike : null;
                        resort.weather = {
                            temp,
                            tempF: temp !== null ? `${temp}°` : '—',
                            feelsLike,
                            feelsLikeF: feelsLike !== null ? `${feelsLike}°` : '—',
                            wind: live.weather.wind,
                            condition: live.weather.condition,
                            icon: live.weather.icon
                        };
                        weatherUpdatedCount++;
                    }

                    // ── Forecast (OpenWeather) ──
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

                    // ── Lift Status (Liftie) ──
                    if (live.lifts) {
                        if (!resort.lifts || typeof resort.lifts !== 'object') {
                            resort.lifts = {};
                        }
                        resort.lifts.open = live.lifts.open;
                        resort.lifts.total = live.lifts.total;
                        resort.lifts.closed = live.lifts.total - live.lifts.open;
                        resort.hasLiftie = true;
                        liftUpdatedCount++;

                        // Store individual lift details for the dropdown
                        if (live.lifts.details) {
                            resort.liftDetails = live.lifts.details;
                        }

                    }
                });

                // Recalculate ratings
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
                statusDiv.innerHTML = `
                    <span style="font-size: 1.2rem;">✓</span>
                    <div style="line-height: 1.4;">
                        <div>Live data • ${time}</div>
                        <div style="font-size: 0.65rem; opacity: 0.9;">Weather: ${weatherCount}/${resorts.length} • Lifts: ${liftCount} via Liftie</div>
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

        // Initialize
        loadLiveData().catch(err => console.warn('Initial load failed:', err));
        setInterval(loadLiveData, REFRESH_INTERVAL);

        // 🎿 EPIC RAIL SLAM - Click Handler with Delayed Scroll
        document.addEventListener('DOMContentLoaded', () => {
            const ctaBtn = document.querySelector('.cta-btn');
            if (ctaBtn) {
                ctaBtn.addEventListener('click', function(e) {
                    e.preventDefault(); // Prevent any default behavior

                    // Add the slam animation class
                    this.classList.add('rail-slam');

                    // Haptic feedback on mobile
                    if (navigator.vibrate) {
                        navigator.vibrate([50, 30, 50, 20, 30]);
                    }

                    // Wait for slam effect, then scroll
                    setTimeout(() => {
                        const filters = document.querySelector('.filters');
                        if (filters) {
                            const headerHeight = document.querySelector('header').offsetHeight;
                            const filtersTop = filters.getBoundingClientRect().top + window.pageYOffset;
                            window.scrollTo({
                                top: filtersTop - headerHeight - 10,
                                behavior: 'smooth'
                            });
                        }
                    }, 500); // 500ms delay for slam effect (animation is 600ms)

                    // Remove animation class after it completes
                    setTimeout(() => {
                        this.classList.remove('rail-slam');
                    }, 600);
                });
            }
        });

        // Mobile rating bubble scroll activation
        // Detects when rating bubbles scroll into viewport and activates them
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px', // Trigger when bubble enters middle 60% of viewport
                threshold: [0, 0.1, 0.5, 0.9, 1]
            };

            const bubbleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const bubble = entry.target;

                    // Activate when bubble is visible in the viewport sweet spot
                    if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                        bubble.classList.add('mobile-active');
                    } else {
                        bubble.classList.remove('mobile-active');
                    }
                });
            }, observerOptions);

            // Observe all rating bubbles (with a slight delay to ensure DOM is ready)
            const observeRatingBubbles = () => {
                document.querySelectorAll('.rating-text').forEach(bubble => {
                    // Only observe if not already observed
                    if (!bubble.hasAttribute('data-observed')) {
                        bubble.setAttribute('data-observed', 'true');
                        bubbleObserver.observe(bubble);
                    }
                });
            };

            // Initial observation
            setTimeout(observeRatingBubbles, 100);

            // Watch for new bubbles being added (when filters change, etc.)
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

        // 🏔️ BACK TO TOP BUTTON - Show/Hide & Click Handler
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

            // Show/hide on scroll
            window.addEventListener('scroll', toggleBackToTop);

            // Initial check
            toggleBackToTop();

            // Click handler - SKIER JUMPS INTO GONDOLA, RIDES TO TOP
            backToTopBtn.addEventListener('click', function() {
                if (this.classList.contains('launching')) return;

                // Add launch animation
                this.classList.add('launching');

                // Haptic feedback - multiple bumps like loading into gondola
                if (navigator.vibrate) {
                    navigator.vibrate([40, 30, 40, 30, 40]);
                }

                // Delay scroll so gondola ride is visible first.
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 1700);

                // Remove animation class after gondola ride completes
                setTimeout(() => {
                    this.classList.remove('launching');

                    // Force reset of pseudo-elements (defensive fix for mobile)
                    const beforeEl = window.getComputedStyle(this, '::before');
                    const afterEl = window.getComputedStyle(this, '::after');
                    void beforeEl.transform; // Force reflow
                    void afterEl.transform;
                }, 3900); // Match gondola ascent duration
            });
        } else {
            console.error('❌ Back to top button not found!');
        }

        // Send It Meter - Fills on scroll
        const sendItMessages = [
            "Verdict: Send it.",
            "Confidence: Reckless.",
            "Conditions: Doesn't matter.",
            "We're going.",
            "Edges mandatory.",
            "Snow = yes. Ice = also yes."
        ];

        function updateSendItMeter() {
            const randomMessage = sendItMessages[Math.floor(Math.random() * sendItMessages.length)];
            const messageElement = document.getElementById('sendItMessage');

            if (messageElement) {
                messageElement.textContent = randomMessage;
            }
        }

        // Update random message on page load
        updateSendItMeter();

        // Fill bar based on scroll position
        function updateSendItProgress() {
            const footer = document.querySelector('.ski-footer');
            if (!footer) return;

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const footerTop = footer.offsetTop;

            // Calculate how far user has scrolled as percentage
            const maxScroll = documentHeight - windowHeight;
            const scrollPercentage = (scrollTop / maxScroll) * 100;

            // Update progress bar and percentage text
            const progressBar = document.getElementById('sendItProgress');
            const percentageText = document.getElementById('sendItPercentage');

            if (progressBar) {
                progressBar.style.width = `${Math.min(100, scrollPercentage)}%`;
            }

            if (percentageText) {
                percentageText.textContent = `${Math.min(100, Math.round(scrollPercentage))}%`;
            }
        }

        // Listen for scroll events
        window.addEventListener('scroll', updateSendItProgress);

        // Initialize on page load
        updateSendItProgress();
