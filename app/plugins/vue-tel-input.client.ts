import VueTelInput from 'vue-tel-input'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTelInput, {
    inputOptions: {
      showDialCode: true,
      placeholder: 'Enter phone number',
    },
    dropdownOptions: {
      showDialCodeInList: true,
      showDialCodeInSelection: true,
      showFlags: true,
    },
    autoFormat: true,
  })
})
