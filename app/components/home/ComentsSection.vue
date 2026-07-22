<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import type { Testimonial } from '~/types/testimonial'

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: {
      en: "Sergey",
      ru: "Сергей"
    },
    letter: {
      en: "S",
      ru: "С"
    },
    tour: {
      en: "Gyumri, Armenia",
      ru: "Гюмри, Армения"
    },
    comment: {
      en: "Arthur jan, good evening. I remember our visit to the Molokans when we met fellow countrymen))) Thank you so much for everything you do. You guide tours at a very high quality! True guides like you are hard to find))) Wishing you health and good luck in life!",
      ru: "Артур джан, добрый вечер. Помню наше посещение молокан, когда мы встретили земляков))) Спасибо тебе огромное, за то, что ты есть. Ты очень качественно проводишь экскурсии! Таких Гидов поискать))) Здоровья тебе и удачи в жизни!"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    name: {
      en: "Natalya",
      ru: "Наталья"
    },
    letter: {
      en: "N",
      ru: "Н"
    },
    tour: {
      en: "Custom Armenia Journey",
      ru: "Индивидуальное путешествие по Армении"
    },
    comment: {
      en: "Oh, our highly respected Arthur-jan! Thank you for introducing us to Armenia! Everything in this trip was wonderful: the comfortable car and your driving skills (not once did I feel the urge to 'hit the brakes'), your hospitality and desire to share the beauty with us, historical facts, interesting stories, and lots of humor! It was lovely to talk about wine—wine is an integral part of the impressions of Armenia! Expertly chosen pit stops: where to enjoy fresh fruit, where to get a quick and inexpensive bite, where the delicious wine is. You can't describe it all! But we remember our trip with you with warmth in our hearts, smiles on our faces, and a desire to return to Armenia.🥰",
      ru: "О наш многоуважаемый Артур-джан! Спасибо за знакомство с Арменией! В этом путешествии всё было прекрасно: комфортабельный автомобиль и Ваше мастерство вождения (ни разу не возникло желание „нажать на педаль тормоза“), гостеприимство и желание делиться с нами красотой, исторические факты, интересные истории и много юмора! Приятно было поговорить на винную тему, вино — неотъемлемая часть впечатлений об Армении! Пит-стопы со знанием дела: где полакомиться фруктами, где быстро и недорого подкрепиться, где вкусное вино. Всего не опишешь! Но мы вспоминаем наше путешествие с Вами с теплотой в душе, улыбкой на лице и желанием вернуться в Армению.🥰",
    },  
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    id: 3,
    name: {
      en: "Vladimir",
      ru: "Владимир"
    },
    letter: {
      en: "V",
      ru: "В"
    },
    tour: {
      en: "Noravank Canyon",
      ru: "Нораванк и каньон"
    },
    comment: {
      en: "We took a one-day route with Arthur, managed to do everything, and saw everything. We really liked the route—the mountains are incredibly diverse and beautiful, especially the gorge where Noravank is located—as well as the storytelling. Arthur is a very engaging conversationalist with extensive knowledge of Armenian history. Of course, it became clear that a two-day trip option would have been more productive and even more interesting, so for those who have the opportunity.",
      ru: "Ездили с Артуром однодневный маршрут, все успели, все посмотрели. Очень понравился и маршрут, горы очень разнообразные и красивые, особенно ущелье, где находится Нораванк, и рассказ, Артур очень интересный собеседник и обширными знаниями по истории Армении. Конечно, стало понятно, что вариант путешествия на два дня был бы более продуктивным и ещё более интересным, так что у кого есть возможность."
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-rose-500 to-pink-600'
  },
  { 
    id: 4,
    name: {
      en: "Natalya",
      ru: "Наталья"
    },
    letter: {
      en: "N",
      ru: "Н"
    },
    tour: {
      en: "Highlights of Armenia",
      ru: "Главные достопримечательности Армении"
    },
    comment: {
      en: "This tour is a must! A day packed with the beauty and wonders of Armenia. My family was absolutely thrilled, and we are experienced travelers. Thanks to the wonderful Arthur!",
      ru: "Эту экскурсию нельзя пропустить! День, насыщенный красотами и интересностями Армении. Моя семья была полна впечатлений, а мы — опытные путешественники. Спасибо замечательному Артуру!"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-indigo-500 to-blue-600'
  },
  {
    id: 5,
    name: {
      en: 'Pavlina',
      ru: 'Pavlina'
    },
    letter: {
      en: 'P',
      ru: 'П'
    },
    tour: {
      en: "Across Armenia",
      ru: "Путешествие по Армении"
    },
    comment: {
      en: "We really enjoyed the 2-day tour 'Great Journey across Armenia'. We saw many amazing places and learned a lot of new things. Arthur is a wonderful guide who introduced us to the history of Armenia in a very engaging, high-quality, informative, and dynamic way. We highly recommend Arthur as a true professional — an experienced, cheerful guide who genuinely loves his work! Thank you so much, we absolutely loved everything.",
      ru: 'Очень понравилась 2-х дневная экскурсия ‘Большое путешествие по Армении’. Мы увидели много удивительных мест и узнали много нового. Артур - замечательный гид, очень интересно, качественно, информативно и динамично познакомил нас с историей Армении. Рекомендуем Артура как настоящего профессионала - опытного, жизнерадостного и любящего свою работу гида! Огромное спасибо, нам всё очень понравилось.'
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-cyan-500 to-teal-600'
  },
  {
    id: 6,
    name: {
      en: 'Veronika',
      ru: 'Вероника'
    },
    letter: {
      en: 'V',
      ru: 'В'
    },
    tour: {
      en: "Tatev & Khndzoresk",
      ru: "Татев и Хндзореск"
    },
    comment: {
      en: "The excursion with Arthur was simply amazing! Magnificent tour program. In just 1 day we drove through half the country, and it was not tiring at all! We visited Noravank, Areni cave, an 18-meter waterfall, then reached the \"Wings of Tatev\" cable car and visited the Tatev Monastery. The strongest impression for us was the cave city and the suspension bridge. I highly recommend this route! Despite the duration of the excursion, all participants easily endured the trip, even a very elderly person! Arthur is an ideal guide!!!!! Superb presentation of material, deep knowledge of history and national traditions, desire to convey information to the tourists — this is all our guide!!! It is also necessary to note the high service and comfort of the trip: a luxurious minivan was provided, water and pillows were prepared in advance for each participant. Arthur is very tactful and delicate, an experienced and careful driver. And as the finale of this excursion, Arthur turned on a selection of beautiful classical and national music for us on the way back. The car has a great stereo system, we felt like we were sitting in a concert hall! For 4 hours of the return journey, we enjoyed the music! It was very cool!!! Arthur, thank you for this unforgettable day!!!!",
      ru: "Экскурсия с Артуром-джаном была просто потрясающей! Великолепная тур программа. Всего за 1 день мы проехали через полстраны и это совсем не было утомительно! Посетили Нораванк, пещеру Арени, 18-ти метровый водопад, далее добрались до канатной дороги «Крылья Татева», посетили Татевский монастырь. Самое сильное впечатление для нас это город-пещера, подвесной мост. Очень советую этот маршрут! Несмотря на продолжительность экскурсии все участники легко перенесли дорогу и даже очень пожилой человек! Артур - идеальный гид!!!!! Прекрасная подача материала, глубокие знания истории и народных традиций, желание донести информацию до туристов - это все наш гид!!! Также необходимо отметить высокий сервис и комфорт поездки: предоставлен шикарный минивэн, заранее для каждого участника приготовлена вода, подушки. Артур очень тактичный и деликатный, опытный и аккуратный водитель. И в качестве финала этой экскурсии Артур включил нам подборку красивой классической и народной музыки по дороге обратно. В машине отличная акустика, такое чувство будто сидишь в концертном зале! На протяжении 4 часов обратной дороги мы наслаждались музыкой! Было очень круто!!! Артур, спасибо тебе за этот незабываемый день!!!!"
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  {
    id: 7,
    name: {
      en: 'Natalya',
      ru: 'Наталья'
    },
    letter: {
      en: 'N',
      ru: 'Н'
    },
    tour: {
      en: "Southern Armenia",
      ru: "Южная Армения"
    },
    comment: {
      en: 'A huge thank you to our guide Arthur for a magnificent trip! This is not just a 5 out of 5, this is a 5+++! A very educational, action-packed day. Our tour took almost 15 hours. We saw everything that was planned and went everywhere at a pace comfortable for us, giving as much attention to each site as we wanted and getting answers to all of our questions. And the stork village! I never expected there could be so many of them! Thanks again!',
      ru: 'Огромное спасибо гиду Артуру за великолепную поездку! Это не просто 5 из 5, это 5+++! Очень познавательный, насыщенный день. Наш тур занял почти 15 часов. Всё, что было запланировано, увидели и везде побывали в удобном нам темпе и уделив столько внимания каждому объекту, сколько нам хотелось и получив ответы на все наши вопросы. А деревня аистов! Я никак не ожидала, что их может быть так много! Ещё раз - спасибо!'
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    id: 8,
    name: {
      en: 'Valentina',
      ru: 'Валентина'
    },
    letter: {
      en: 'V',
      ru: 'В'
    },
    tour: {
      en: "Great Armenia Journey",
      ru: "Большое путешествие по Армении"
    },
    comment: {
      en: 'A truly great journey! We traveled with our guide Arthur. We are very grateful for the interesting historical facts, comfortable driving, and locations. Special thanks for the photos, Arthur is an excellent photographer ))))',
      ru: 'По-настоящему большое путешествие ! Мы путешествовали с гидом Артуром . Очень благодарны за интересные исторические факты , комфортное вождение , локации . Отдельное спасибо за фотографии , Артур отлично фотографирует ))))'
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-rose-500 to-pink-600'
  },
  {
    id: 9,
    name: {
      en: 'Vitaliy',
      ru: 'Виталий'
    },
    letter: {
      en: 'V',
      ru: 'В'
    },
    tour: {
      en: "Private Armenia Tour",
      ru: "Индивидуальный тур по Армении"
    },
    comment: {
      en: 'Arthur is a magnificent guide and the route itself is very interesting!',
      ru: 'Артур великолепный гид и сам маршрут очень интересный!'
    },
    rating: 5,
    avatarColor: 'bg-gradient-to-br from-emerald-500 to-teal-600'
  },
  {
    id: 10,
    name: {
      en: "David",
      ru: "Давид"
    },
    letter: {
      en: "D",
      ru: "Д"
    },
    tour: {
      en: "Culture & Heritage",
      ru: "Культура и наследие"
    },
    comment: {
      en: "The delight from the excursion will stay with us for a long time! It was an exciting and incredibly action-packed adventure that allowed us to learn many interesting facts about the culture and history of this amazing country. This excursion exceeded my expectations thanks to a professional guide - Arthur, who easily introduced us to the history and culture of Armenia.",
      ru: "Восторг от экскурсии останется с нами надолго! Это было захватывающее и невероятно насыщенное приключение, которое позволило нам узнать множество интересных фактов о культуре и истории этой удивительной страны. Эта экскурсия превзошла мои ожидания благодаря профессиональному гиду - Артуру, который с легкостью ввел нас в историю и культуру Армении."
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-sky-500 to-blue-600"
  },
  {
    id: 11,
    name: {
      en: "Lola",
      ru: "Лола"
    },
    letter: {
      en: "L",
      ru: "Л"
    },
    tour: {
      en: "Best of Armenia",
      ru: "Лучшее в Армении"
    },
    comment: {
      en: "Stop reading reviews and take this tour 👌 this is the best and most comprehensive program. The locations are very beautiful, ask for guide Arthur. He is magnificent. Then we take...",
      ru: "Останавливайтесь в чтение отзывов и берите эту экскурсию 👌 это лучшая и самая обширная программа. Локации очень красивые, просите гида Артура. Он великолепен. Потом берем..."
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-cyan-500 to-teal-600"
  },
  {
    id: 12,
    name: {
      en: "Igor",
      ru: "Игорь"
    },
    letter: {
      en: "I",
      ru: "И"
    },
    tour: {
      en: "Wine & Sightseeing",
      ru: "Вино и достопримечательности"
    },
    comment: {
      en: "We had Arthur as our guide — he shared information in a very accessible and concise way, keeping all of our wishes in mind. The route was well-planned, with beautiful locations and incredible views. The car was very spacious and clean. Definitely recommend! We tasted plenty of wine, sang songs on the way back, thanks to Arthur for his patience! :)",
      ru: "У нас был гид Артур - очень доступно и лаконично доносил информацию, учитывал все пожелания. Маршрут продуманный, красивые локации, невероятные виды. Автомобильный очень просторный и чистый. Однозначно рекомендую! Надегустировались вина, пели на обратном пути песни, спасибо Артуру за терпение! :)"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-slate-600 to-zinc-800"
  },
  {
    id: 13,
    name: {
      en: "Diana",
      ru: "Диана"
    },
    letter: {
      en: "D",
      ru: "Д"
    },
    tour: {
      en: "Armenia Discovery",
      ru: "Открывая Армению"
    },
    comment: {
      en: "The trip was unforgettable! We are very grateful to Arthur for the excellent guidance during the excursion. It was very interesting, comfortable, and pleasant to spend the day with such a wonderful person. We learned everything about the history of the visited attractions, enjoyed the views of nature, and got answers to all our questions. With Arthur, we felt the hospitality and kindness of Armenia. We will definitely come again!)",
      ru: "Путешествие было незабываемым! Очень благодарны Артуру за прекрасное сопровождение во время экскурсии. Нам было очень интересно, комфортно и приятно провести день с таким замечательным человеком. Мы узнали все об истории посещенных достопримечательностей, наслаждались видами природы, получили ответы на все вопросы. С Артуром мы ощутили гостеприимство и доброту Армении. Обязательно приедем еще!)"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-neutral-700 to-slate-900"
  },
  {
    id: 14,
    name: {
      en: "Ekaterina",
      ru: "Екатерина"
    },
    letter: {
      en: "E",
      ru: "Е"
    },
    tour: {
      en: "Historic Armenia",
      ru: "Историческая Армения"
    },
    comment: {
      en: "Many thanks to our guide Arthur for an interesting and action-packed journey. I would especially like to note his erudition and deep knowledge of the history of Armenia. Great gratitude to Arthur for his attentive and caring attitude towards tourists. Despite the duration of the excursion, I highly recommend choosing this specific tour.",
      ru: "Большое спасибо нашему гиду Артуру за интересное и насыщенное путешествие. Особенно хочется отметить его эрудицию и глубокие знания истории Армении. Большая благодарность Артуру за его внимательное и заботливое отношение к туристам. Несмотря на длительность экскурсии, рекомендую выбрать именно эту экскурсию."
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-violet-500 to-purple-600"
  },
  {
    id: 15,
    name: {
      en: "Victoria",
      ru: "Виктория"
    },
    letter: {
      en: "V",
      ru: "В"
    },
    tour: {
      en: "Action-Packed Tour of Armenia",
      ru: "Насыщенная экскурсия по Армении"
    },
    comment: {
      en: "Good day. We chose this tour because it has a more action-packed program compared to others on the website. We had some minor worries because we were the first tourists to book it, but everything went very well. Guide Arthur deserves special thanks; we found common ground from the very first minutes. It was very interesting and comfortable with him throughout the day, and we learned a lot of interesting things. I recommend it to everyone, you won't regret it!",
      ru: "Добрый день. Выбрали данную экскурсию, т.к. она имеет более насыщенно программу по-сравнению с другими на сайте. Были небольшие переживания, т.к. мы были первыми туристами её забронировавшими, но все прошло очень хорошо. Гид Артур заслуживает отдельной благодарности, с первых минут нашли общий язык. Было очень интересно и комфортно с ним на протяжении всего дня, много узнали интересного. Всем рекомендую, не пожалеете!"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-teal-500 to-cyan-600"
  },
  {
    id: 16,
    name: {
      en: "Margarita",
      ru: "Маргарита"
    },
    letter: {
      en: "M",
      ru: "М"
    },
    tour: {
      en: "Personalized Route",
      ru: "Индивидуальный маршрут"
    },
    comment: {
      en: "We went on a tour with Arthur as our guide. The route was built very well, no fatigue was felt at all. Arthur was very attentive, adapted to our wishes, very patient and friendly. And of course, he is a very interesting storyteller.",
      ru: "Ездили на экскурсию с гидом Артуром. Очень хорошо построен маршрут, никакой усталости не ощущалось. Артур был очень внимателен, подстраивался под наши \"хотелки\", очень выдержанный и доброжелательный. И конечно, очень интересный рассказчик."
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-indigo-500 to-blue-600"
  },
  {
    id: 17,
    name: {
      en: "Irina",
      ru: "Ирина"
    },
    letter: {
      en: "I",
      ru: "И"
    },
    tour: {
      en: "Authentic Armenia",
      ru: "Самобытная Армения"
    },
    comment: {
      en: "An incredible journey with an amazing guide! A person of rare warmth and sincerity, Arthur revealed an authentic, vibrant, colorful, and deeply spiritual Armenia to us. It was a true pleasure to listen to his stories and see the country through his eyes. Thank you so much for Armenia! We fell deeply in love with it 🙏",
      ru: "Невероятное путешествие с удивительным гидом! Редкой теплоты и душевности человек, Артур открыл нам Армению очень самобытной, яркой, колоритной и высоко духовной. Удовольствие слушать его рассказы и видеть страну его глазами. Спасибо огромное за Армению! Очень ее полюбили 🙏"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-rose-500 to-orange-500"
  },
  {
    id: 18,
    name: {
      en: "Alla",
      ru: "Алла"
    },
    letter: {
      en: "A",
      ru: "А"
    },
    tour: {
      en: "Cave City Adventure",
      ru: "Путешествие в пещерный город"
    },
    comment: {
      en: "Arthur is a very erudite guide. We spent 15 hours with him: we saw and learned so much in one day! Arthur is intelligent, with a subtle sense of humor, and surrounded us with care and attention. We listened to him open-mouthed) We especially liked the last location: the cave city. Thank you, Arthur!)",
      ru: "Артур - очень эрудированный гид. Мы провели с ним 15 часов: столько посмотрели и узнали за один день! Артур интеллигентный, с тонким чувством юмора, окружил нас заботой и вниманием. Слушали его, открыв рот) Особенно понравилась последняя локация: пещерный город. Спасибо, Артур!)"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-amber-500 to-orange-600"
  },
  {
    id: 19,
    name: {
      en: "Marina",
      ru: "Марина"
    },
    letter: {
      en: "M",
      ru: "М"
    },
    tour: {
      en: "Armenia Highlights",
      ru: "Главные места Армении"
    },
    comment: {
      en: "Excellent tour",
      ru: "Отличная экскурсия"
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-purple-500 to-pink-500"
  },
  {
    id: 20,
    name: {
      en: "Zinaida",
      ru: "Зинаида"
    },
    letter: {
      en: "Z",
      ru: "З"
    },
    tour: {
      en: "Great Armenia Journey",
      ru: "Большое путешествие по Армении"
    },
    comment: {
      en: "On January 10, 2025, we went on the \"Great Journey across Armenia\" with Arthur. It was very nice that, at our request, the non-operational Shaki Waterfall was replaced with Khor Virap. The route turned out to be very interesting. Arthur knows history perfectly, tells stories interestingly, and plans time excellently. We managed to visit all the sights. We recommend him.",
      ru: "10 января 2025 года ездили в \"Большое путешествие по Армении\" с Артуром. Было очень приятно ,что по нашей просьбе неработающий водопад Шаки заменили на Хор Вирап. Маршрут получился очень интересный. Артур прекрасно знает историю, интересно рассказывает, отлично планирует время. Успели посетить все достопримечательности. Рекомендуем."
    },
    rating: 5,
    avatarColor: "bg-gradient-to-br from-teal-500 to-emerald-600"
  },
]
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
