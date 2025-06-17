<?php

/**
 * Plugin Name: Product Analyzer for WooCommerce
 * Plugin URI: https://webcafe.ge
 * Description: პროდუქტის ანალიტიკა WooCommerce-სთვის — დამატებითი ღილაკი პროდუქტის სიაში.
 * Version: 1.0
 * Author: webcafe.ge
 * Author URI: https://webcafe.ge
 * Text Domain: admin-product-filters
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */
if (!defined('ABSPATH')) exit;

// პლაგინის "დონაცია" და "პლაგინის შესახებ" ღილაკების დამატება პლაგინების გვერდზე
add_filter('plugin_row_meta', function ($links, $file) {
    if ($file === plugin_basename(__FILE__)) {
        $links[] = '<a href="#" class="plugin-info-popup-button" style="cursor:pointer;color:#0073aa;">პლაგინის შესახებ</a>';
        $links[] = '<a href="https://www.kisa.ge/donate/uW9RD9YEEsf69W42vt67" target="_blank" style="color:#0073aa;">💖 დონაცია</a>';
    }
    return $links;
}, 10, 2);



// ადმინ გვერდზე ჩატვირთვისას ჩართე ჩვენი სკრიპტები და სტილები (პლაგინების გვერდზე)
add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'plugins.php') {
        wp_enqueue_style('product-analyzer-style', plugin_dir_url(__FILE__) . 'css/style.css');
        wp_enqueue_script('product-analyzer-plugin-info', plugin_dir_url(__FILE__) . 'js/plugin-info.js', ['jquery'], null, true);
    }
});

// AJAX-ი საჭირო არ არის, რადგან აღწერა ფიქსირებული ტექსტია, ვაჩვენებთ JS-ით პოპაპში

// სტილებისა და სკრიპტების ჩატვირთვა
add_action('admin_enqueue_scripts', function () {
    wp_enqueue_style('product-analyzer-style', plugin_dir_url(__FILE__) . 'css/style.css');
    wp_enqueue_script('product-analyzer-script', plugin_dir_url(__FILE__) . 'js/script.js', ['jquery'], null, true);
    wp_localize_script('product-analyzer-script', 'productAnalyzerAjax', [
        'ajax_url' => admin_url('admin-ajax.php')
    ]);
});

// Row Actions-ში "ანალიტიკის" ბმული
add_filter('post_row_actions', function ($actions, $post) {
    if ($post->post_type === 'product') {
        $analyze_button = '<a href="#" class="product-analyzer-button" data-product-id="' . esc_attr($post->ID) . '">🔍 პროდუქტზე ანალიტიკა</a>';
        if (current_user_can('manage_woocommerce')) {
            $actions['product_analyzer'] = $analyze_button;
        }
    }
    return $actions;
}, 10, 2);

// AJAX ანალიტიკის ჰენდლერი
add_action('wp_ajax_get_product_analysis', function () {
    $product_id = intval($_POST['product_id']);
    $product = wc_get_product($product_id);

    if (!$product) {
        wp_send_json_error(['message' => 'პროდუქტი ვერ მოიძებნა']);
    }

    // ატრიბუტების დათვლა
    $attributes = $product->get_attributes();
    $attribute_count = 0;
    foreach ($attributes as $attribute) {
        if ($attribute->is_visible() && $attribute->get_options()) {
            $attribute_count++;
        }
    }

    // ანალიტიკის ველები
    $fields = [
        'პროდუქტის სახელი' => get_the_title($product_id),
        'პროდუქტის აღწერა' => $product->get_description(),
        'პროდუქტის მოკლე აღწერა' => $product->get_short_description(),
        'ჩვეულებრივი ფასი' => $product->get_regular_price(),
        'არტიკული (SKU)' => $product->get_sku(),
        'ატრიბუტები (მინ. 5)' => $attribute_count >= 5 ? "✅ ($attribute_count / 5)" : false,
        'პროდუქტის კატეგორიები' => count(wp_get_post_terms($product_id, 'product_cat')) > 0 ? '✅' : false,
        'პროდუქტის სურათი' => has_post_thumbnail($product_id) ? '✅' : false,
        'პროდუქტის გალერია' => count($product->get_gallery_image_ids()) > 0 ? '✅' : false,
    ];

    $filled = 0;
    $total = count($fields);
    $unfilled_fields = [];
    $filled_fields = [];

    foreach ($fields as $label => $value) {
        if (empty($value) || $value === false || $value === '0') {
            $unfilled_fields[] = $label;
        } else {
            $filled++;
            $filled_fields[] = $label;
        }
    }

    $percent = round(($filled / $total) * 100);

   wp_send_json_success([
    'filled_percent' => $percent,
    'filled_fields' => $filled_fields,
    'unfilled_fields' => $unfilled_fields,
    'product_name' => $product->get_name(),
    'product_image' => get_the_post_thumbnail_url($product_id, 'medium')
    ]);
});
