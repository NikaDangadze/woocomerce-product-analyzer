jQuery(document).ready(function($) {
    // პოპაპის HTML
    const popupHTML = `
        <div id="plugin-info-popup" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);
            background:#fff; padding:20px; max-width:600px; width:90%; box-shadow:0 0 15px rgba(0,0,0,0.3); z-index:99999; border-radius:8px;">
            <h2>Product Analyzer for WooCommerce</h2>
            <p>
                Product Analyzer for WooCommerce არის მარტივი, მაგრამ ძლიერად ეფექტური WordPress პლაგინი, რომელიც გეხმარება WooCommerce მაღაზიაში არსებული პროდუქტების მონაცემთა სიზუსტის და სიხარისწის შეფასებაში.
            </p>
            <p>
                ამ პლაგინის მეშვეობით ადმინ პანელში, პროდუქტის სიაში თითოეულ პროდუქტთან დამატებულია ღილაკი – <strong>„პროდუქტზე ანალიტიკა“</strong>, რომლის მეშვეობითაც ერთ კლიკში ნახავთ კონკრეტული პროდუქტის:
            </p>
            <ul>
                <li>შევსებული ველების რაოდენობას (% მაჩვენებლით)</li>
                <li>კონკრეტულად რომელი ველები შევსებულია და რომელი — არა</li>
                <li>დეტალურად გაწერილ ატრიბუტებს (min. 5)</li>
                <li>პროდუქტის ფოტოების, გალერეის, აღწერის, კატეგორიების სტატუსს</li>
            </ul>
            <p>
                პოპაპში ასევე ჩანს შევსებული ველები მწვანედ, ხოლო დაუსრულებელი — წითლად, რაც მარტივად გასაგებს ხდის ვიზუალურად მონაცემთა სტატუსს.
            </p>
            <button id="plugin-info-popup-close" style="background:#0073aa;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">დახურვა</button>
        </div>
        <div id="plugin-info-popup-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99998;"></div>
    `;

    $('body').append(popupHTML);

    $('.plugin-info-popup-button').on('click', function(e) {
        e.preventDefault();
        $('#plugin-info-popup, #plugin-info-popup-overlay').fadeIn();
    });

    $('#plugin-info-popup-close, #plugin-info-popup-overlay').on('click', function() {
        $('#plugin-info-popup, #plugin-info-popup-overlay').fadeOut();
    });
});
