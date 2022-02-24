(function() {
    var init = function() {
        initEvent()
    }


    var loginFormSubmit = function(e) {
        e.preventDefault()
        if (!username.value.trim() || !userPassword.value.trim()) {
            window.alert("用户名或密码不能为空")
            return
        }
        ajax({
            url: 'https://api.duyiedu.com/api/student/stuLogin',
            type: "POST",
            params: { // 我要给售货员钱
                appkey: 'alan_1627900246598',
                account: username.value,
                password: userPassword.value,
            },
            success: function(res) {
                res = JSON.parse(res)
                window.alert(res.msg)
                if (res.status === 'success') {
                    window.location.href = './main.html?name=' + username;
                }
            }
        })
    }


    var initEvent = function() {
        loginForm.addEventListener("submit", loginFormSubmit)
    }

    init()
})()