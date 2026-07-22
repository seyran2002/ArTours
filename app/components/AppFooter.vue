<script setup lang="ts">
import { useLocalePath } from '#imports'
const localePath = useLocalePath()
</script>

<template>
  <footer class="bg-zinc-50 border-t border-zinc-200/50 pt-6 sm:pt-8 pb-16 sm:pb-20 md:mb-0 select-none">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-8">
      
      <!-- Main Footer Grid (4-Column Layout on Desktop) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-6 border-b border-zinc-200/40">
        
        <!-- Column 1: Brand Info (Col 4) -->
        <div class="md:col-span-4 space-y-3.5">
          <NuxtLink :to="localePath('/')" class="inline-block group outline-none select-none" aria-label="ArTours home">
            <NuxtImg 
              src="/logo.webp" 
              alt="ArTours Logo" 
              width="192"
              height="192"
              format="webp"
              quality="60"
              loading="lazy"
              class="h-16 md:h-24 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]" 
            />
          </NuxtLink>
          
          <p class="text-xs text-zinc-500 leading-relaxed max-w-sm font-medium">
            {{ $t('footer.description') }}
          </p>
        </div>

        <!-- Column 2: Navigation (ONLY visible on desktop & large tablets) (Col 2) -->
        <div class="hidden md:block md:col-span-2 space-y-3.5">
          <h3 class="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-900 font-sans">
            {{ $t('footer.navigation') }}
          </h3>
          <nav aria-label="Footer navigation">
            <ul class="space-y-2 text-xs text-zinc-500 font-semibold">
              <li>
                <NuxtLink :to="localePath('/')" class="hover:text-primary transition-colors focus-visible:text-primary outline-none">{{ $t('footer.links.home') }}</NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/tours')" class="hover:text-primary transition-colors focus-visible:text-primary outline-none">{{ $t('footer.links.tours') }}</NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/about')" class="hover:text-primary transition-colors focus-visible:text-primary outline-none">{{ $t('footer.links.about') }}</NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/contact')" class="hover:text-primary transition-colors focus-visible:text-primary outline-none">{{ $t('footer.links.contact') }}</NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/booking-status')" class="hover:text-primary transition-colors focus-visible:text-primary outline-none">{{ $t('footer.links.booking') }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Wrapper for Columns 3 & 4 (Displays side-by-side on mobile, aligns inline on desktop) -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-8 md:col-span-6">
          
          <!-- Column 3: Visually Structured Contact Details (Col 3 on desktop) -->
          <div class="md:col-span-3 space-y-3.5">
            <h3 class="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-900 font-sans">
              {{ $t('footer.contactDetails') }}
            </h3>
            
            <address class="not-italic space-y-2.5">
              <!-- Phone Number -->
              <div class="flex items-start gap-2.5 group">
                <span class="p-1.5 bg-white border border-zinc-200/60 rounded-lg text-primary flex items-center justify-center shrink-0 shadow-sm transition-colors group-hover:border-primary/20">
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div class="space-y-0.5">
                  <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">{{ $t('footer.contact.directLine') }}</span>
                  <a href="tel:+37455425595" class="text-xs text-zinc-600 hover:text-primary transition-colors font-semibold block outline-none">
                    +374 55 42 55 95
                  </a>
                </div>
              </div>

              <!-- Gmail -->
              <div class="flex items-start gap-2.5 group">
                <span class="p-1.5 bg-white border border-zinc-200/60 rounded-lg text-primary flex items-center justify-center shrink-0 shadow-sm transition-colors group-hover:border-primary/20">
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div class="space-y-0.5">
                  <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">{{ $t('footer.contact.email') }}</span>
                  <a href="mailto:artoursarmenia@gmail.com" class="text-xs text-zinc-600 hover:text-primary transition-colors font-semibold block outline-none">
                    ArToursArmenia@gmail.com
                  </a>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-start gap-2.5 group">
                <span class="p-1.5 bg-white border border-zinc-200/60 rounded-lg text-primary flex items-center justify-center shrink-0 shadow-sm transition-colors group-hover:border-primary/20">
                  <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div class="space-y-0.5">
                  <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">{{ $t('footer.contact.location') }}</span>
                  <span class="text-xs text-zinc-600 font-semibold block">
                    {{ $t('footer.contact.address') }}
                  </span>
                </div>
              </div>
            </address>
          </div>

          <!-- Column 4: Isolated Social Links with Permanent Brand Colors (Col 3 on desktop) -->
          <div class="md:col-span-3 space-y-3.5">
            <h3 class="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-900 font-sans">
              {{ $t('footer.social') }}
            </h3>
            
            <ul class="space-y-2.5 text-xs text-zinc-500 font-semibold" aria-label="Social media channels">
              <!-- WhatsApp -->
              <li>
                <a 
                  href="https://wa.me/37410555555" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 group hover:text-primary transition-colors outline-none"
                >
                  <span class="p-1.5 bg-white border border-zinc-200/60 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <svg class="w-3.5 h-3.5 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.59 1.981 14.119.957 11.5.957c-5.442 0-9.87 4.372-9.874 9.802-.001 1.73.461 3.413 1.34 4.906L1.93 21.03l5.525-1.454zm10.37-6.843c-.27-.135-1.597-.788-1.845-.878-.247-.09-.427-.135-.607.135-.18.27-.697.878-.854 1.058-.158.18-.315.202-.585.067-.27-.135-1.14-.42-2.172-1.34-.803-.717-1.345-1.603-1.502-1.873-.158-.27-.017-.417.118-.552.122-.121.27-.315.405-.473.135-.158.18-.27.27-.45.09-.18.045-.338-.022-.473-.068-.135-.607-1.463-.832-2.003-.22-.53-.44-.457-.607-.466-.157-.008-.337-.009-.517-.009-.18 0-.472.067-.719.338-.247.27-.944.923-.944 2.25s.967 2.61 1.102 2.79c.135.18 1.902 2.904 4.609 4.074.645.278 1.148.445 1.54.57.65.207 1.241.177 1.709.107.521-.078 1.597-.653 1.822-1.283.225-.63.225-1.17.157-1.283-.067-.113-.247-.203-.517-.338z"/>
                    </svg>
                  </span>
                  <span class="group-hover:text-primary transition-colors">WhatsApp</span>
                </a>
              </li>

              <!-- Telegram -->
              <li>
                <a 
                  href="https://t.me/artours" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 group hover:text-primary transition-colors outline-none"
                >
                  <span class="p-1.5 bg-white border border-zinc-200/60 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <svg class="w-3.5 h-3.5 fill-[#0088cc] translate-x-[-0.5px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.2-.02-.08.02-1.3 1.13-3.66 2.73-.35.24-.66.36-.94.35-.3-.01-.89-.18-1.32-.32-.53-.17-.95-.26-.91-.56.02-.15.23-.31.63-.47 2.47-1.07 4.12-1.78 4.95-2.1 2.35-.93 2.84-1.09 3.16-1.1.07 0 .23.02.33.1.09.08.12.18.13.26 0 .05.01.15 0 .22z"/>
                    </svg>
                  </span>
                  <span class="group-hover:text-primary transition-colors">Telegram</span>
                </a>
              </li>

              <!-- Instagram -->
              <li>
                <a 
                  href="https://instagram.com/artours" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 group hover:text-primary transition-colors outline-none"
                >
                  <span class="p-1.5 bg-white border border-zinc-200/60 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <svg class="w-3.5 h-3.5 fill-[#E1306C]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </span>
                  <span class="group-hover:text-primary transition-colors">Instagram</span>
                </a>
              </li>

              <!-- Facebook -->
              <li>
                <a 
                  href="https://facebook.com/artours" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex items-center gap-2.5 group hover:text-primary transition-colors outline-none"
                >
                  <span class="p-1.5 bg-white border border-zinc-200/60 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                    <svg class="w-3.5 h-3.5 fill-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </span>
                  <span class="group-hover:text-primary transition-colors">Facebook</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

      </div>

      <!-- Lower Section: Copyright Info -->
      <div class="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
        <p class="text-center sm:text-left leading-normal">
          &copy; {{ $t('footer.copyright') }}
        </p>
        <p class="text-center sm:text-right text-zinc-500 font-semibold lowercase tracking-normal">
          sustainable, immersive travel coordination
        </p>
      </div>

    </div>
  </footer>
</template>