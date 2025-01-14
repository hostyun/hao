$(function() {
    const $searchText = $('#search-text');
    const $word = $('#word');
    // 防止重复请求：添加一个定时器
    let searchTimeout;
    $searchText.keyup(function() {
        const keywords = $(this).val();
        // 如果输入框为空，隐藏提示
        if (keywords === '') {
            $word.empty().hide();
            return;
        }
        // 防止过快输入发起过多请求
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            fetchSuggestions(keywords);
        }, 150);  // 延迟150毫秒后发起请求
    });
    // 发起请求获取 Google Suggest 数据
    function fetchSuggestions(keywords) {
        $.ajax({
            url: 'https://suggestqueries.google.com/complete/search?client=firefox&q=' + keywords,
            dataType: 'jsonp',
            success: function(data) {
                $word.empty().show();

                if (data[1].length === 0) {
                    $word.hide();  // 如果没有结果，隐藏提示框
                    return;
                }
                // 如果有建议，显示每个建议项
                $.each(data[1], function(index, item) {
                    $word.append('<li>' + item + '</li>');
                });
            },
            error: function() {
                $word.empty().hide();  // 出错时，隐藏提示框
            }
        });
    }
    // 点击搜索建议时，将其复制到搜索框
    $(document).on('click', '#word li', function() {
        const word = $(this).text();
        $searchText.val(word);
        $word.empty().hide();  // 选择建议后，清空并隐藏提示框
        $('.submit').trigger('click');  // 触发搜索提交按钮
    });
    // 点击其他区域时隐藏搜索建议框
    $(document).on('click', '.container, .banner-video, nav', function() {
        $word.empty().hide();
    });
});
