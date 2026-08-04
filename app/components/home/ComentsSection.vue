<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import type { Testimonial } from '~/types/testimonial'

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: {
      en: "Sergey",
      ru: "Сергей",
      hy: "Սերգեյ"
    },
    letter: {
      en: "S",
      ru: "С",
      hy: "Ս"
    },
    tour: {
      en: "Gyumri, Armenia",
      ru: "Гюмри, Армения",
      hy: "Գյումրի, Հայաստան"
    },
    comment: {
      en: "Arthur jan, good evening. I remember our visit to the Molokans when we met fellow countrymen))) Thank you so much for everything you do. You guide tours at a very high quality! True guides like you are hard to find))) Wishing you health and good luck in life!",
      ru: "Артур джан, добрый вечер. Помню наше посещение молокан, когда мы встретили земляков))) Спасибо тебе огромное, за то, что ты есть. Ты очень качественно проводишь экскурсии! Таких Гидов поискать))) Здоровья тебе и удачи в жизни!",
      hy: "Արթուր ջան, բարի երեկո: Հիշում եմ մեր այցը մոլոկաններին, երբ հանդիպեցինք մեր հայրենակիցներին))) Շատ շնորհակալություն ամեն ինչի համար: Դու էքսկուրսիաներն անցկացնում ես շատ բարձր մակարդակով: Քեզ նման իսկական ուղեկցորդներ դժվար է գտնել))) Առողջություն և հաջողություն եմ մաղթում կյանքում:"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    name: {
      en: "Natalya",
      ru: "Наталья",
      hy: "Նատալյա"
    },
    letter: {
      en: "N",
      ru: "Н",
      hy: "Ն"
    },
    tour: {
      en: "Custom Armenia Journey",
      ru: "Индивидуальное путешествие по Армении",
      hy: "Անհատական ճամփորդություն Հայաստանով"
    },
    comment: {
      en: "Oh, our highly respected Arthur-jan! Thank you for introducing us to Armenia! Everything in this trip was wonderful: the comfortable car and your driving skills (not once did I feel the urge to 'hit the brakes'), your hospitality and desire to share the beauty with us, historical facts, interesting stories, and lots of humor! It was lovely to talk about wine—wine is an integral part of the impressions of Armenia! Expertly chosen pit stops: where to enjoy fresh fruit, where to get a quick and inexpensive bite, where the delicious wine is. You can't describe it all! But we remember our trip with you with warmth in our hearts, smiles on our faces, and a desire to return to Armenia.🥰",
      ru: "О наш многоуважаемый Артур-джан! Спасибо за знакомство с Арменией! В этом путешествии всё было прекрасно: комфортабельный автомобиль и Ваше мастерство вождения (ни разу не возникло желание „нажать на педаль тормоза“), гостеприимство и желание делиться с нами красотой, исторические факты, интересные истории и много юмора! Приятно было поговорить на винную тему, вино — неотъемлемая часть впечатлений об Армении! Пит-стопы со знанием дела: где полакомиться фруктами, где быстро и недорого подкрепиться, где вкусное вино. Всего не опишешь! Но мы вспоминаем наше путешествие с Вами с теплотой в душе, улыбкой на лице и желанием вернуться в Армению.🥰",
      hy: "Օ~, մեր շատ հարգելի Արթուր-ջան: Շնորհակալություն Հայաստանի հետ ծանոթացնելու համար: Այս ճամփորդության մեջ ամեն ինչ հրաշալի էր՝ հարմարավետ մեքենան և Ձեր վարորդական հմտությունները (ոչ մի անգամ «արգելակին սեղմելու» ցանկություն չառաջացավ), հյուրընկալությունը և մեզ հետ գեղեցկությունը կիսելու ցանկությունը, պատմական փաստերը, հետաքրքիր պատմությունները և շատ հումոր: Հաճելի էր զրուցել գինու շուրջ. գինին Հայաստանի տպավորությունների անբաժանելի մասն է: Գիտակցաբար ընտրված կանգառներ՝ որտեղ վայելել մրգեր, որտեղ արագ ու էժան ուտել, որտեղ է համեղ գինին: Ամեն ինչ չես նկարագրի: Բայց մենք Ձեզ հետ մեր ճամփորդությունը հիշում ենք սրտի ջերմությամբ, դեմքին ժպիտով և Հայաստան վերադառնալու ցանկությամբ:🥰"
    },  
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    id: 3,
    name: {
      en: "Vladimir",
      ru: "Владимир",
      hy: "Վլադիմիր"
    },
    letter: {
      en: "V",
      ru: "В",
      hy: "Վ"
    },
    tour: {
      en: "Noravank Canyon",
      ru: "Нораванк и каньон",
      hy: "Նորավանք և կիրճ"
    },
    comment: {
      en: "We took a one-day route with Arthur, managed to do everything, and saw everything. We really liked the route—the mountains are incredibly diverse and beautiful, especially the gorge where Noravank is located—as well as the storytelling. Arthur is a very engaging conversationalist with extensive knowledge of Armenian history. Of course, it became clear that a two-day trip option would have been more productive and even more interesting, so for those who have the opportunity.",
      ru: "Ездили с Артуром однодневный маршрут, все успели, все посмотрели. Очень понравился и маршрут, горы очень разнообразные и красивые, особенно ущелье, где находится Нораванк, и рассказ, Артур очень интересный собеседник и обширными знаниями по истории Армении. Конечно, стало понятно, что вариант путешествия на два дня был бы более продуктивным и ещё более интересным, так что у кого есть возможность.",
      hy: "Արթուրի հետ գնացինք մեկօրյա երթուղով, ամեն ինչ հասցրեցինք, ամեն ինչ տեսանք: Շատ հավանեցինք ինչպես երթուղին՝ լեռները շատ բազմազան են ու գեղեցիկ, հատկապես կիրճը, որտեղ գտնվում է Նորավանքը, այնպես էլ պատմությունները: Արթուրը շատ հետաքրքիր զրուցակից է՝ Հայաստանի պատմության խորը գիտելիքներով: Անշուշտ, պարզ դարձավ, որ երկօրյա տարբերակն ավելի արդյունավետ և էլ ավելի հետաքրքիր կլիներ, այնպես որ՝ ով հնարավորություն ունի, խորհուրդ եմ տալիս:"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-rose-500 to-pink-600'
  },
  { 
    id: 4,
    name: {
      en: "Natalya",
      ru: "Наталья",
      hy: "Նատալյա"
    },
    letter: {
      en: "N",
      ru: "Н",
      hy: "Ն"
    },
    tour: {
      en: "Highlights of Armenia",
      ru: "Главные достопримечательности Армении",
      hy: "Հայաստանի գլխավոր տեսարժան վայրերը"
    },
    comment: {
      en: "This tour is a must! A day packed with the beauty and wonders of Armenia. My family was absolutely thrilled, and we are experienced travelers. Thanks to the wonderful Arthur!",
      ru: "Эту экскурсию нельзя пропустить! День, насыщенный красотами и интересностями Армении. Моя семья была полна впечатлений, а мы — опытные путешественники. Спасибо замечательному Артуру!",
      hy: "Այս էքսկուրսիան ուղղակի չի կարելի բաց թողնել: Հայաստանի գեղեցկություններով և հետաքրքրություններով հագեցած օր: Իմ ընտանիքը հիացած էր, իսկ մենք փորձառու ճանապարհորդներ ենք: Շնորհակալություն հրաշալի Արթուրին:"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-indigo-500 to-blue-600'
  },
  {
    id: 5,
    name: {
      en: 'Pavlina',
      ru: 'Pavlina',
      hy: 'Պավլինա'
    },
    letter: {
      en: 'P',
      ru: 'П',
      hy: 'Պ'
    },
    tour: {
      en: "Across Armenia",
      ru: "Путешествие по Армении",
      hy: "Ճանապարհորդություն Հայաստանով"
    },
    comment: {
      en: "We really enjoyed the 2-day tour 'Great Journey across Armenia'. We saw many amazing places and learned a lot of new things. Arthur is a wonderful guide who introduced us to the history of Armenia in a very engaging, high-quality, informative, and dynamic way. We highly recommend Arthur as a true professional — an experienced, cheerful guide who genuinely loves his work! Thank you so much, we absolutely loved everything.",
      ru: 'Очень понравилась 2-х дневная экскурсия ‘Большое путешествие по Армении’. Мы увидели много удивительных мест и узнали много нового. Артур - замечательный гид, очень интересно, качественно, информативно и динамично познакомил нас с историей Армении. Рекомендуем Артура как настоящего профессионала - опытного, жизнерадостного и любящего свою работу гида! Огромное спасибо, нам всё очень понравилось.',
      hy: "Շատ հավանեցինք «Մեծ ճանապարհորդություն Հայաստանով» 2-օրյա էքսկուրսիան: Տեսանք շատ զարմանահրաշ վայրեր և իմացանք շատ նոր բաներ: Արթուրը հրաշալի ուղեկցորդ է, ով շատ հետաքրքիր, որակյալ, տեղեկատվական և դինամիկ ձևով մեզ ծանոթացրեց Հայաստանի պատմությանը: Խորհուրդ ենք տալիս Արթուրին որպես իսկական պրոֆեսիոնալի՝ փորձառու, ուրախ և իր աշխատանքը սիրող ուղեկցորդի: Շատ շնորհակալություն, մեզ ամեն ինչ շատ դուր եկավ:"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-cyan-500 to-teal-600'
  },
  {
    id: 6,
    name: {
      en: 'Veronika',
      ru: 'Вероника',
      hy: 'Վերոնիկա'
    },
    letter: {
      en: 'V',
      ru: 'В',
      hy: 'Վ'
    },
    tour: {
      en: "Tatev & Khndzoresk",
      ru: "Татев и Хндзореск",
      hy: "Տաթև և Խնձորեսկ"
    },
    comment: {
      en: "The excursion with Arthur was simply amazing! Magnificent tour program. In just 1 day we drove through half the country, and it was not tiring at all! We visited Noravank, Areni cave, an 18-meter waterfall, then reached the \"Wings of Tatev\" cable car and visited the Tatev Monastery. The strongest impression for us was the cave city and the suspension bridge. I highly recommend this route! Despite the duration of the excursion, all participants easily endured the trip, even a very elderly person! Arthur is an ideal guide!!!!! Superb presentation of material, deep knowledge of history and national traditions, desire to convey information to the tourists — this is all our guide!!! It is also necessary to note the high service and comfort of the trip: a luxurious minivan was provided, water and pillows were prepared in advance for each participant. Arthur is very tactful and delicate, an experienced and careful driver. And as the finale of this excursion, Arthur turned on a selection of beautiful classical and national music for us on the way back. The car has a great stereo system, we felt like we were sitting in a concert hall! For 4 hours of the return journey, we enjoyed the music! It was very cool!!! Arthur, thank you for this unforgettable day!!!!",
      ru: "Экскурсия с Артуром-джаном была просто потрясающей! Великолепная тур программа. Всего за 1 день мы проехали через полстраны и это совсем не было утомительно! Посетили Нораванк, пещеру Арени, 18-ти метровый водопад, далее добрались до канатной дороги «Крылья Татева», посетили Татевский монастырь. Самое сильное впечатление для нас это город-пещера, подвесной мост. Очень советую этот маршрут! Несмотря на продолжительность экскурсии все участники легко перенесли дорогу и даже очень пожилой человек! Артур - идеальный гид!!!!! Прекрасная подача материала, глубокие знания истории и народных традиций, желание донести информацию до туристов - это все наш гид!!! Также необходимо отметить высокий сервис и комфорт поездки: предоставлен шикарный минивэн, заранее для каждого участника приготовлена вода, подушки. Артур очень тактичный и деликатный, опытный и аккуратный водитель. И в качестве финала этой экскурсии Артур включил нам подборку красивой классической и народной музыки по дороге обратно. В машине отличная акустика, такое чувство будто сидишь в концертном зале! На протяжении 4 часов обратной дороги мы наслаждались музыкой! Было очень круто!!! Артур, спасибо тебе за этот незабываемый день!!!!",
      hy: "Էքսկուրսիան Արթուր-ջանի հետ ուղղակի հիանալի էր: Շքեղ ծրագիր: Ընդամենը 1 օրում անցանք երկրի կեսը, և դա բոլորովին հոգնեցուցիչ չէր: Այցելեցինք Նորավանք, Առենիի քարանձավ, 18 մետրանոց ջրվեժ, այնուհետև հասանք «Տաթևի թևեր» ճոպանուղի և այցելեցինք Տաթևի վանք: Ամենաուժեղ տպավորությունը մեզ վրա թողեց քարանձավային քաղաքն ու ճոճվող կամուրջը: Շատ եմ խորհուրդ տալիս այս երթուղին: Չնայած էքսկուրսիայի տևողությանը՝ բոլոր մասնակիցները հեշտությամբ տանեցին ճանապարհը, նույնիսկ տարեց մարդը: Արթուրը կատարյալ ուղեկցորդ է: Նյութի գերազանց մատուցում, պատմության և ազգային ավանդույթների խորը իմացություն, զբոսաշրջիկներին տեղեկատվություն հասցնելու ցանկություն. սա ամբողջովին մեր ուղեկցորդն է: Անհրաժեշտ է նշել նաև բարձր սպասարկումն ու հարմարավետությունը. տրամադրվել էր շքեղ մինիվեն, յուրաքանչյուր մասնակցի համար նախապես պատրաստված էր ջուր և բարձեր: Արթուրը շատ տակտով է, փորձառու և զգույշ վարորդ: Եվ որպես այս էքսկուրսիայի ավարտ՝ Արթուրը վերադարձի ճանապարհին միացրեց դասական և ազգային երաժշտության գեղեցիկ ընտրանի: Մեքենայում հիանալի ակուստիկա է, կարծես համերգասրահում նստած լինեինք: Վերադարձի 4 ժամվա ընթացքում վայելում էինք երաժշտությունը: Շատ կույտ էր: Արթուր, շնորհակալություն այս անմոռանալի օրվա համար:"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  {
    id: 7,
    name: {
      en: 'Natalya',
      ru: 'Наталья',
      hy: 'Նատալյա'
    },
    letter: {
      en: 'N',
      ru: 'Н',
      hy: 'Ն'
    },
    tour: {
      en: "Southern Armenia",
      ru: "Южная Армения",
      hy: "Հարավային Հայաստան"
    },
    comment: {
      en: 'A huge thank you to our guide Arthur for a magnificent trip! This is not just a 5 out of 5, this is a 5+++! A very educational, action-packed day. Our tour took almost 15 hours. We saw everything that was planned and went everywhere at a pace comfortable for us, giving as much attention to each site as we wanted and getting answers to all of our questions. And the stork village! I never expected there could be so many of them! Thanks again!',
      ru: 'Огромное спасибо гиду Артуру за великолепную поездку! Это не просто 5 из 5, это 5+++! Очень познавательный, насыщенный день. Наш тур занял почти 15 часов. Всё, что было запланировано, увидели и везде побывали в удобном нам темпе и уделив столько внимания каждому объекту, сколько нам хотелось и получив ответы на все наши вопросы. А деревня аистов! Я никак не ожидала, что их может быть так много! Ещё раз - спасибо!',
      hy: "Անչափ շնորհակալություն մեր ուղեկցորդ Արթուրին հոյակապ ճամփորդության համար: Սա ուղղակի 5-ից 5 չէ, սա 5+++ է: Շատ ուսուցողական, հագեցած օր: Մեր տուրը տևեց գրեթե 15 ժամ: Տեսանք այն ամենը, ինչ ծրագրված էր, և եղանք ամենուր մեզ համար հարմար տեմպով՝ յուրաքանչյուր տեսարժան վայրին հատկացնելով այնքան ժամանակ, որքան ցանկանում էինք, և ստացանք մեր բոլոր հարցերի պատասխանները: Իսկ արագիլների գյուղը: Երբեք չէի սպասում, որ դրանք կարող են այդքան շատ լինել: Կրկին շնորհակալություն:"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    id: 8,
    name: {
      en: 'Valentina',
      ru: 'Валентина',
      hy: 'Վալենտինա'
    },
    letter: {
      en: 'V',
      ru: 'В',
      hy: 'Վ'
    },
    tour: {
      en: "Great Armenia Journey",
      ru: "Большое путешествие по Армении",
      hy: "Մեծ ճանապարհորդություն Հայաստանով"
    },
    comment: {
      en: 'A truly great journey! We traveled with our guide Arthur. We are very grateful for the interesting historical facts, comfortable driving, and locations. Special thanks for the photos, Arthur is an excellent photographer ))))',
      ru: 'По-настоящему большое путешествие ! Мы путешествовали с гидом Артуром . Очень благодарны за интересные исторические факты , комфортное вождение , локации . Отдельное спасибо за фотографии , Артур отлично фотографирует ))))',
      hy: "Իսկապես մեծ ճանապարհորդություն: Մենք ճամփորդում էինք մեր ուղեկցորդ Արթուրի հետ: Շատ շնորհակալ ենք հետաքրքիր պատմական փաստերի, հարմարավետ վարելու և վայրերի համար: Առանձնահատուկ շնորհակալություն լուսանկարների համար, Արթուրը հիանալի լուսանկարում է ))))"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-rose-500 to-pink-600'
  },
  {
    id: 9,
    name: {
      en: 'Vitaliy',
      ru: 'Виталий',
      hy: 'Վիտալի'
    },
    letter: {
      en: 'V',
      ru: 'В',
      hy: 'Վ'
    },
    tour: {
      en: "Private Armenia Tour",
      ru: "Индивидуальный тур по Армении",
      hy: "Անհատական տուր Հայաստանում"
    },
    comment: {
      en: 'Arthur is a magnificent guide and the route itself is very interesting!',
      ru: 'Артур великолепный гид и сам маршрут очень интересный!',
      hy: "Արթուրը հոյակապ ուղեկցորդ է, իսկ երթուղին ինքնին շատ հետաքրքիր է:"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  {
    id: 10,
    name: {
      en: "David",
      ru: "Давид",
      hy: "Դավիթ"
    },
    letter: {
      en: "D",
      ru: "Д",
      hy: "Դ"
    },
    tour: {
      en: "Culture & Heritage",
      ru: "Культура и наследие",
      hy: "Մշակույթ և ժառանգություն"
    },
    comment: {
      en: "The delight from the excursion will stay with us for a long time! It was an exciting and incredibly action-packed adventure that allowed us to learn many interesting facts about the culture and history of this amazing country. This excursion exceeded my expectations thanks to a professional guide - Arthur, who easily introduced us to the history and culture of Armenia.",
      ru: "Восторг от экскурсии останется с нами надолго! Это было захватывающее и невероятно насыщенное приключение, которое позволило нам узнать множество интересных фактов о культуре и истории этой удивительной страны. Эта экскурсия превзошла мои ожидания благодаря профессиональному гиду - Артуру, который с легкостью ввел нас в историю и культуру Армении.",
      hy: "Էքսկուրսիայից ստացած հիացմունքը երկար ժամանակ կմնա մեզ հետ: Սա հուզիչ և անհավանականորեն հագեցած արկած էր, որը թույլ տվեց իմանալ բազմաթիվ հետաքրքիր փաստեր այս հրաշալի երկրի մշակույթի և պատմության մասին: Այս էքսկուրսիան գերազանցեց իմ սպասելիքները շնորհիվ պրոֆեսիոնալ ուղեկցորդ Արթուրի, ով հեշտությամբ մեզ ներկայացրեց Հայաստանի պատմությունն ու մշակույթը:"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-sky-500 to-blue-600"
  },
  {
    id: 11,
    name: {
      en: "Lola",
      ru: "Лола",
      hy: "Լոլա"
    },
    letter: {
      en: "L",
      ru: "Л",
      hy: "Լ"
    },
    tour: {
      en: "Best of Armenia",
      ru: "Лучшее в Армении",
      hy: "Լավագույնը Հայաստանում"
    },
    comment: {
      en: "Stop reading reviews and take this tour 👌 this is the best and most comprehensive program. The locations are very beautiful, ask for guide Arthur. He is magnificent. Then we take...",
      ru: "Останавливайтесь в чтение отзывов и берите эту экскурсию 👌 это лучшая и самая обширная программа. Локации очень красивые, просите гида Артура. Он великолепен. Потом берем...",
      hy: "Դադարեցրեք կարծիքներ կարդալը և ընտրեք այս էքսկուրսիան 👌 սա լավագույն և ամենաընդգրկուն ծրագիրն է: Վայրերը շատ գեղեցիկ են, խնդրեք ուղեկցորդ Արթուրին: Նա հոյակապ է: Հետո վերցնում ենք..."
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-cyan-500 to-teal-600"
  },
  {
    id: 12,
    name: {
      en: "Igor",
      ru: "Игорь",
      hy: "Իգոր"
    },
    letter: {
      en: "I",
      ru: "И",
      hy: "Ի"
    },
    tour: {
      en: "Wine & Sightseeing",
      ru: "Вино и достопримечательности",
      hy: "Գինի և տեսարժան վայրեր"
    },
    comment: {
      en: "We had Arthur as our guide — he shared information in a very accessible and concise way, keeping all of our wishes in mind. The route was well-planned, with beautiful locations and incredible views. The car was very spacious and clean. Definitely recommend! We tasted plenty of wine, sang songs on the way back, thanks to Arthur for his patience! :)",
      ru: "У нас был гид Артур - очень доступно и лаконично доносил информацию, учитывал все пожелания. Маршрут продуманный, красивые локации, невероятные виды. Автомобильный очень просторный и чистый. Однозначно рекомендую! Надегустировались вина, пели на обратном пути песни, спасибо Артуру за терпение! :)",
      hy: "Մեր ուղեկցորդն Արթուրն էր. նա շատ մատչելի և հակիրճ էր ներկայացնում տեղեկատվությունը, հաշվի էր առնում մեր բոլոր ցանկությունները: Երթուղին մտածված էր, գեղեցիկ վայրերով և անհավանական տեսարաններով: Մեքենան շատ ընդարձակ էր և մաքուր: Միանշանակ խորհուրդ եմ տալիս: Վայելեցինք բավականաչափ գինի, վերադարձի ճանապարհին երգեր երգեցինք, շնորհակալություն Արթուրին իր համբերատարության համար: :)"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-slate-600 to-zinc-800"
  },
  {
    id: 13,
    name: {
      en: "Diana",
      ru: "Диана",
      hy: "Դիանա"
    },
    letter: {
      en: "D",
      ru: "Д",
      hy: "Դ"
    },
    tour: {
      en: "Armenia Discovery",
      ru: "Открывая Армению",
      hy: "Բացահայտելով Հայաստանը"
    },
    comment: {
      en: "The trip was unforgettable! We are very grateful to Arthur for the excellent guidance during the excursion. It was very interesting, comfortable, and pleasant to spend the day with such a wonderful person. We learned everything about the history of the visited attractions, enjoyed the views of nature, and got answers to all our questions. With Arthur, we felt the hospitality and kindness of Armenia. We will definitely come again!)",
      ru: "Путешествие было незабываемым! Очень благодарны Артуру за прекрасное сопровождение во время экскурсии. Нам было очень интересно, комфортно и приятно провести день с таким замечательным человеком. Мы узнали все об истории посещенных достопримечательностей, наслаждались видами природы, получили ответы на все вопросы. С Артуром мы ощутили гостеприимство и доброту Армении. Обязательно приедем еще!)",
      hy: "Ճամփորդությունն անմոռանալի էր: Շատ շնորհակալ ենք Արթուրին էքսկուրսիայի ընթացքում հիանալի ուղեկցության համար: Մեզ համար շատ հետաքրքիր, հարմարավետ և հաճելի էր օրն անցկացնել նման հրաշալի մարդու հետ: Մենք իմացանք ամեն ինչ այցելած տեսարժան վայրերի պատմության մասին, վայելեցինք բնության տեսարանները և ստացանք բոլոր հարցերի պատասխանները: Արթուրի հետ մենք զգացինք Հայաստանի հյուրընկալությունն ու բարությունը: Անպայման նորից կգանք:)"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-neutral-700 to-slate-900"
  },
  {
    id: 14,
    name: {
      en: "Ekaterina",
      ru: "Екатерина",
      hy: "Եկատերինա"
    },
    letter: {
      en: "E",
      ru: "Е",
      hy: "Ե"
    },
    tour: {
      en: "Historic Armenia",
      ru: "Историческая Армения",
      hy: "Պատմական Հայաստան"
    },
    comment: {
      en: "Many thanks to our guide Arthur for an interesting and action-packed journey. I would especially like to note his erudition and deep knowledge of the history of Armenia. Great gratitude to Arthur for his attentive and caring attitude towards tourists. Despite the duration of the excursion, I highly recommend choosing this specific tour.",
      ru: "Большое спасибо нашему гиду Артуру за интересное и насыщенное путешествие. Особенно хочется отметить его эрудицию и глубокие знания истории Армении. Большая благодарность Артуру за его внимательное и заботливое отношение к туристам. Несмотря на длительность экскурсии, рекомендую выбрать именно эту экскурсию.",
      hy: "Շատ շնորհակալություն մեր ուղեկցորդ Արթուրին հետաքրքիր և հագեցած ճամփորդության համար: Հատկապես կուզենայի նշել նրա էրուդիցիան և Հայաստանի պատմության խորը իմացությունը: Մեծ շնորհակալություն Արթուրին զբոսաշրջիկների հանդեպ ուշադիր և հոգատար վերաբերմունքի համար: Չնայած էքսկուրսիայի տևողությանը՝ խիստ խորհուրդ եմ տալիս ընտրել հենց այս տուրը:"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-violet-500 to-purple-600"
  },
  {
    id: 15,
    name: {
      en: "Victoria",
      ru: "Виктория",
      hy: "Վիկտորիա"
    },
    letter: {
      en: "V",
      ru: "В",
      hy: "Վ"
    },
    tour: {
      en: "Action-Packed Tour of Armenia",
      ru: "Насыщенная экскурсия по Армении",
      hy: "Հագեցած էքսկուրսիա Հայաստանով"
    },
    comment: {
      en: "Good day. We chose this tour because it has a more action-packed program compared to others on the website. We had some minor worries because we were the first tourists to book it, but everything went very well. Guide Arthur deserves special thanks; we found common ground from the very first minutes. It was very interesting and comfortable with him throughout the day, and we learned a lot of interesting things. I recommend it to everyone, you won't regret it!",
      ru: "Добрый день. Выбрали данную экскурсию, т.к. она имеет более насыщенно программу по-сравнению с другими на сайте. Были небольшие переживания, т.к. мы были первыми туристами её забронировавшими, но все прошло очень хорошо. Гид Артур заслуживает отдельной благодарности, с первых минут нашли общий язык. Было очень интересно и комфортно с ним на протяжении всего дня, много узнали интересного. Всем рекомендую, не пожалеете!",
      hy: "Բարի օր: Ընտրեցինք այս էքսկուրսիան, քանի որ այն ունի ավելի հագեցած ծրագիր՝ համեմատած կայքի մյուս տուրերի հետ: Փոքր-ինչ մտահոգություններ կային, քանի որ մենք առաջին զբոսաշրջիկներն էինք, ովքեր ամրագրել էին այն, բայց ամեն ինչ անցավ շատ լավ: Ուղեկցորդ Արթուրն արժանի է առանձնահատուկ շնորհակալության, հենց առաջին րոպեներից ընդհանուր լեզու գտանք: Նրա հետ ամբողջ օրվա ընթացքում շատ հետաքրքիր ու հարմարավետ էր, շատ հետաքրքիր բաներ իմացանք: Բոլորին խորհուրդ եմ տալիս, չեք փոշմանի:"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-teal-500 to-cyan-600"
  },
  {
    id: 16,
    name: {
      en: "Margarita",
      ru: "Маргарита",
      hy: "Մարգարիտա"
    },
    letter: {
      en: "M",
      ru: "М",
      hy: "Մ"
    },
    tour: {
      en: "Personalized Route",
      ru: "Индивидуальный маршрут",
      hy: "Անհատական երթուղի"
    },
    comment: {
      en: "We went on a tour with Arthur as our guide. The route was built very well, no fatigue was felt at all. Arthur was very attentive, adapted to our wishes, very patient and friendly. And of course, he is a very interesting storyteller.",
      ru: "Ездили на экскурсию с гидом Артуром. Очень хорошо построен маршрут, никакой усталости не ощущалось. Артур был очень внимателен, подстраивался под наши \"хотелки\", очень выдержанный и доброжелательный. И конечно, очень интересный рассказчик.",
      hy: "Գնացինք էքսկուրսիայի Արթուրի հետ: Երթուղին շատ լավ էր կազմված, ոչ մի հոգնածություն չզգացվեց: Արթուրը շատ ուշադիր էր, հարմարվում էր մեր ցանկություններին, շատ համբերատար էր և բարեհամբույր: Եվ իհարկե, նա շատ հետաքրքիր պատմող է:"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-indigo-500 to-blue-600"
  },
  {
    id: 17,
    name: {
      en: "Irina",
      ru: "Ирина",
      hy: "Իրինա"
    },
    letter: {
      en: "I",
      ru: "И",
      hy: "Ի"
    },
    tour: {
      en: "Authentic Armenia",
      ru: "Самобытная Армения",
      hy: "Ինքնատիպ Հայաստան"
    },
    comment: {
      en: "An incredible journey with an amazing guide! A person of rare warmth and sincerity, Arthur revealed an authentic, vibrant, colorful, and deeply spiritual Armenia to us. It was a true pleasure to listen to his stories and see the country through his eyes. Thank you so much for Armenia! We fell deeply in love with it 🙏",
      ru: "Невероятное путешествие с удивительным гидом! Редкой теплоты и душевности человек, Артур открыл нам Армению очень самобытной, яркой, колоритной и высоко духовной. Удовольствие слушать его рассказы и видеть страну его глазами. Спасибо огромное за Армению! Очень ее полюбили 🙏",
      hy: "Անհավանական ճամփորդություն հրաշալի ուղեկցորդի հետ: Բացառիկ ջերմության և ջերմեռանդության տեր մարդ, Արթուրը մեզ համար բացահայտեց շատ ինքնատիպ, վառ, կոլորիտային և խորապես հոգևոր Հայաստանը: Իսկական հաճույք էր նրա պատմությունները լսելը և երկիրը նրա աչքերով տեսնելը: Շատ շնորհակալություն Հայաստանի համար: Այն շատ սիրեցինք 🙏"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-rose-500 to-orange-500"
  },
  {
    id: 18,
    name: {
      en: "Alla",
      ru: "Алла",
      hy: "Ալլա"
    },
    letter: {
      en: "A",
      ru: "А",
      hy: "Ա"
    },
    tour: {
      en: "Cave City Adventure",
      ru: "Путешествие в пещерный город",
      hy: "Ճանապարհորդություն դեպի քարանձավային քաղաք"
    },
    comment: {
      en: "Arthur is a very erudite guide. We spent 15 hours with him: we saw and learned so much in one day! Arthur is intelligent, with a subtle sense of humor, and surrounded us with care and attention. We listened to him open-mouthed) We especially liked the last location: the cave city. Thank you, Arthur!)",
      ru: "Артур - очень эрудированный гид. Мы провели с ним 15 часов: столько посмотрели и узнали за один день! Артур интеллигентный, с тонким чувством юмора, окружил нас заботой и вниманием. Слушали его, открыв рот) Особенно понравилась последняя локация: пещерный город. Спасибо, Артур!)",
      hy: "Արթուրը շատ էրուդիտացված ուղեկցորդ է: Նրա հետ անցկացրեցինք 15 ժամ. մեկ օրում այնքան բան տեսանք ու իմացանք: Արթուրը մտավորական է, հումորի նուրբ զգացումով, մեզ շրջապատեց հոգատարությամբ ու ուշադրությամբ: Լսում էինք նրան բերանբաց) Հատկապես դուր եկավ վերջին վայրը՝ քարանձավային քաղաքը: Շնորհակալություն, Արթուր:)"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-amber-500 to-orange-600"
  },
  {
    id: 19,
    name: {
      en: "Marina",
      ru: "Марина",
      hy: "Մարինա"
    },
    letter: {
      en: "M",
      ru: "М",
      hy: "Մ"
    },
    tour: {
      en: "Armenia Highlights",
      ru: "Главные места Армении",
      hy: "Հայաստանի գլխավոր վայրերը"
    },
    comment: {
      en: "Excellent tour",
      ru: "Отличная экскурсия",
      hy: "Գերազանց էքսկուրսիա"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-purple-500 to-pink-500"
  },
  {
    id: 20,
    name: {
      en: "Zinaida",
      ru: "Зинаида",
      hy: "Զինաիդա"
    },
    letter: {
      en: "Z",
      ru: "З",
      hy: "Զ"
    },
    tour: {
      en: "Great Armenia Journey",
      ru: "Большое путешествие по Армении",
      hy: "Մեծ ճանապարհորդություն Հայաստանով"
    },
    comment: {
      en: "On January 10, 2025, we went on the \"Great Journey across Armenia\" with Arthur. It was very nice that, at our request, the non-operational Shaki Waterfall was replaced with Khor Virap. The route turned out to be very interesting. Arthur knows history perfectly, tells stories interestingly, and plans time excellently. We managed to visit all the sights. We recommend him.",
      ru: "10 января 2025 года ездили в \"Большое путешествие по Армении\" с Артуром. Было очень приятно ,что по нашей просьбе неработающий водопад Шаки заменили на Хор Вирап. Маршрут получился очень интересный. Артур прекрасно знает историю, интересно рассказывает, отлично планирует время. Успели посетить все достопримечательности. Рекомендуем.",
      hy: "2025 թվականի հունվարի 10-ին Արթուրի հետ գնացինք «Մեծ ճանապարհորդություն Հայաստանով» տուրին: Շատ հաճելի էր, որ մեր խնդրանքով չգործող Շաքիի ջրվեժը փոխարինվեց Խոր Վիրապով: Երթուղին ստացվեց շատ հետաքրքիր: Արթուրը հիանալի գիտի պատմությունը, հետաքրքիր պատմում է և գերազանց պլանավորում ժամանակը: Հասցրեցինք այցելել բոլոր տեսարժան վայրերը: Խորհուրդ ենք տալիս:"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-teal-500 to-emerald-600"
  }
];
</script>

<template>
  <section class="max-w-[1440px] mx-auto px-6 lg:px-8 relative overflow-hidden">
    <!-- Ambient Backdrop Light (Soft warm gold glow for comments section) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-secondary/15 rounded-full blur-[120px]" />
    </div>

    <!-- Section Header -->
    <div class="text-center max-w-2xl mx-auto space-y-4 mb-10 sm:mb-12">
      <BaseBadge 
        variant="primary" 
        size="sm" 
        pulse 
        pulse-color="secondary" 
        class="tracking-[0.2em] text-primary uppercase font-bold"
      >
        {{ $t('home.comments.badge') }}
      </BaseBadge>
      
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
        {{ $t('home.comments.titlePart1') }} <span class="text-primary">{{ $t('home.comments.titlePart2') }}</span>
      </h2>
      
      <p class="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-xl mx-auto">
        {{ $t('home.comments.description') }}
      </p>
    </div>

    <!-- Infinite Scroll Testimonial Container -->
    <div class="relative w-full overflow-hidden mask-gradient select-none">
      <div class="flex animate-marquee gap-6 py-4">
        <!-- Original Testimonials Track -->
        <div 
          v-for="testimonial in testimonials" 
          :key="'original-' + testimonial.id" 
          class="w-[310px] sm:w-[350px] shrink-0"
        >
          <LazyHomeCommentCard :testimonial="testimonial" />
        </div>
        
        <!-- Duplicated Cloned Track for Seamless Loop -->
        <div 
          v-for="testimonial in testimonials" 
          :key="'clone-' + testimonial.id" 
          class="w-[310px] sm:w-[350px] shrink-0"
        >
          <LazyHomeCommentCard :testimonial="testimonial" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 55s linear infinite;
  will-change: transform;
}

/* Pause flow on hover for reader comfort */
.animate-marquee:hover {
  animation-play-state: paused;
}

/* Luxury fading mask effect on left and right borders */
.mask-gradient {
  mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
}
</style>
