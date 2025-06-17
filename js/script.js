jQuery(document).ready(function ($) {
    // პოპაპი და ლოგო
    $('body').append(`
        <div id="product-analyzer-popup">
            <span id="product-analyzer-popup-close">×</span>
            <div id="product-analyzer-content"></div>
            <img id="product-analyzer-logo" src="https://webcafe.ge/wp-content/uploads/2023/12/webcafe-logo-300x118.webp" alt="WebCafe Logo" />
        </div>
    `);

    // ღილაკზე დაჭერა
    $('.product-analyzer-button').on('click', function () {
        const productId = $(this).data('product-id');

        $.post(productAnalyzerAjax.ajax_url, {
            action: 'get_product_analysis',
            product_id: productId
        }, function (response) {
            if (response.success) {
                const data = response.data;
                let html = '';

                // პროდუქტის სახელი და სურათი
                html += `<div class="product-analyzer-header">`;
                html += `<h2>${data.product_name}</h2>`;
                if (data.product_image) {
                    html += `<img src="${data.product_image}" alt="${data.product_name}" style="max-width: 150px; margin-bottom: 10px; border-radius: 6px;" />`;
                } else {
                    html += `<p style="color: #999;">📷 სურათი არ არის</p>`;
                }
                html += `</div>`;

                html += `<h3>📊 ანალიზის შედეგი</h3>`;
                html += `<p><strong>შევსებულია:</strong> ${data.filled_percent}%</p>`;

                if (data.filled_fields.length > 0) {
                    html += `<p><strong>✅ შევსებული ველები:</strong></p><ul>`;
                    data.filled_fields.forEach(field => {
                        html += `<li class="product-field-filled" style="color:green;">✅ ${field}</li>`;
                    });
                    html += `</ul>`;
                }

                if (data.unfilled_fields.length > 0) {
                    html += `<p><strong>❌ არ არის შევსებული ველები:</strong></p><ul>`;
                    data.unfilled_fields.forEach(field => {
                        html += `<li class="product-field-unfilled" style="color:red;">❌ ${field}</li>`;
                    });
                    html += `</ul>`;
                } else {
                    html += `<p><strong>ყველა ველი შევსებულია ✅</strong></p>`;
                }

                $('#product-analyzer-content').html(html);
                $('#product-analyzer-popup').fadeIn();
            } else {
                alert('დაფიქსირდა შეცდომა');
            }
        });
    });

    // დახურვა
    $(document).on('click', '#product-analyzer-popup-close', function () {
        $('#product-analyzer-popup').fadeOut();
    });
});
