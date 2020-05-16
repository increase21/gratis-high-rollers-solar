$(document).ready(() => {
   let GCountry = null
   let GZip = null
   $.get('https://api.ipdata.co/?api-key=d4b2ec5cd9239b7b126259f0b012f352754ba15ad2ab4e61f23cf748').done(e => {
      GCountry = e.country_code
      GZip = e.postal
      $("#zip").val(GZip)
      if (GZip) {
         $('.auto-detect').removeClass('d-none')
      }
   }).fail((e) => {

   })

   // opening modal
   $(".cta_btn").on("click", () => {
      $("#modal").removeClass("d-none")
      $('body').toggleClass('no-scroll')
      if (GCountry !== 'US') {
         $('#modal-container').html(`<div class="p-5 text-center">
      <h4 class="text-red">Sorry! This is not available in your country!</h4>
      <button type="button" class="btn mt-3 btn-light w-100 close-modal" id="">Cancel</button></div>
      `)
      }
   })
   // closing modal
   $("#close-modal").on("click", () => {
      $("#modal").addClass("d-none")
      $('body').toggleClass('no-scroll')
   })
   $("body").on("click", ".close-modal", () => {
      $("#modal").addClass("d-none")
      $('body').toggleClass('no-scroll')
   })

   let errorDiv = $(".error")

   $("#lead_form_fr").on('submit', (e) => {
      e.preventDefault();
      let fname = $("#fname").val().trim()
      let lname = $("#lname").val().trim()
      let email = $("#email").val().trim()
      let phone = $("#phone").val().trim()
      let addr = $("#addr").val().trim()
      let zip = $("#zip").val().trim()
      let reg = /^[a-z\-]+$/i
      // check first name
      if (fname === "" || !reg.test(fname)) {
         return errorDiv.text("A valid first name is required");
      }
      // check las name
      if (lname === "" || !reg.test(lname)) {
         return errorDiv.text("A valid last name is required");
      }
      // check email
      if (email === "" || /^[\w\_\-\d]+\@[a-z]+\.[a-z]{2,4}\.[a-z]+?$/i.test(email)) {
         return errorDiv.text("A valid email is required");
      }
      // check phone
      if (phone === "" || isNaN(phone) || phone.length > 10) {
         return errorDiv.text("A valid 10 digits phone number is required");
      }
      // check zip
      if (zip === "" || isNaN(zip) || zip.length > 6) {
         return errorDiv.text("A zip code is required");
      }
      $('#submit_btn_click').text('Loading...').prop('disabled', true)
      // let URL = `https://gratisdigital.listflex.com/lmadmin/api/leadimport.php?apikey=TSKQA35V04N9MD6GY4D7&list_id=1692&fname=${fname}&lname=${lname}&email=${email}&phone=${phone}&address=${addr}&zip=${zip}&country=US`
      $.ajax({
         method: "POST",
         url: "https://hooks.zapier.com/hooks/catch/2128931/oi3swwa",
         data: $('#lead_form_fr').serialize()
      }).done(e => {
         if (e.status === 'success') {
            dataLayer.push({ 'event': 'CompleteRegistration' });
            $('#modal-container').html(`<div class="p-5 text-center">
               <h4 class="text-green">Thank You! We will contact you shortly!</h4>
               <button type="button" class="btn mt-3 btn-light w-100 close-modal" id="">Cancel</button></div>
               `)
            return
         } else {
            $('#modal-container').html(`<div class="p-5 text-center">
            <h4 class="text-red">Oops! ${e}</h4>
            <button type="button" class="btn mt-3 btn-light w-100 close-modal" id="">Cancel</button></div>
            `)
         }
      }).fail(e => {
         $('#modal-container').html(`<div class="p-5 text-center">
      <h4 class="text-red">Sorry! Something went wrong, please refresh and try again!</h4>
      `)
      })
   })
})