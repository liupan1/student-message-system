(function() {
    var page = 1;
    var size = 3;
    var totalAmount = 0; // 数据的总数量
    var obj = {}
    var contentItemLists = document.querySelectorAll('.content-item')
    var navLists = document.querySelectorAll('.nav-item')
    var init = function() {
        // 获取数据
        getLists()
        initEvents()
    }

    var initEvents = function() {
        paginationContainer.addEventListener('click', onPaginationClick);
        document.querySelectorAll('.icon').forEach(function(node) {
            node.addEventListener('click', onArrowClick)
        })
        tableContainer.addEventListener('click', onTableContainerClick)

        navLists.forEach(function(node, index) {
            node.addEventListener('click', oNavNodeItemClick.bind(node, index))
        })
    }

    var oNavNodeItemClick = function(index) {
        contentItemLists.forEach(function(node, contentIndex) {
            node.className = contentIndex === index ? 'content-item active' : 'content-item';
            navLists[contentIndex].className = 'nav-item'
        })
        this.className = 'nav-item active'
    }


    var onTableContainerClick = function(e) {
        if (e.target.className === 'edit') {
            editListItem(e.target)
        } else if (e.target.className === 'del') {
            deleteListItem(e.target)
        }
    }

    var editListItem = function(currentNode) {
        tempId = currentNode.getAttribute('uId')
        for (var key in obj[tempId]) {
            document.getElementById(key) && (document.getElementById(key).value = obj[tempId][key])
        }
        dialogContainer.style.display = 'block'
    }

    var deleteListItem = function(currentNode) {
        var uId = currentNode.getAttribute('uId')
        var isConfirm = window.confirm('确认是否删除')
        if (!isConfirm) return
        ajax({
            url: 'https://api.duyiedu.com/api/student/delBySno',
            params: {
                appkey: "Q_A_Q_1590927055348",
                sNo: uId,
            },
            success: function(res) {
                res = JSON.parse(res)
                window.alert(res.msg)
                    // dialogContainer.style.display = 'none'
                    // /* 重新进行数据的渲染 */
                if (page * size - size === totalAmount - 1) {
                    page -= 1
                }
                getLists()
            },
        })
    }

    var onArrowClick = function() {
        var oldPage = page
        if (this.id === 'previous' && page != 1) {
            console.log(2);
            page--
        } else if (this.id === 'next' && page != paginationContainer.children.length) {
            console.log(1);
            page++
        }
        if (oldPage === page) return
        paginationContainer.children[page - 1].click()

    }
    var onPaginationClick = function(e) {
        var target = e.target
        if (target.id === 'paginationContainer') return
        page = target.innerHTML
        getLists()
    }


    var getLists = function() {
        ajax({
            url: "https://api.duyiedu.com/api/student/findByPage",
            type: "GET",
            params: {
                appkey: "Q_A_Q_1590927055348",
                page: page,
                size: size,
            },
            success: function(res) {
                res = JSON.parse(res)
                totalAmount = res.data.cont
                renderTable(res.data.findByPage)
                renderPage()
            }
        })
    }

    var renderTable = function(arr) {
        var dataArr = []
        if (!arr.length) {
            tableContainer.innerHTML = '<tr><td colspan="8">暂无数据</td></tr>'
            return
        }
        arr.forEach((item) => {
            dataArr.push(
                `<tr><td>${item.sNo}</td>
              <td>${item.name}</td>
              <td>${item.sex === 0 ? '男' : '女'}</td>
              <td>${new Date().getFullYear() - item.birth}</td>
              <td>${item.phone}</td>
              <td>${item.email}</td>
              <td>${item.address}</td>
              <td>
              <span uId="${item.sNo}" class="edit" index="0">编辑</span>
              <span uId="${item.sNo}" class="del" index="0">删除</span>
              </td>
                </tr>`
            )
        });
        tableContainer.innerHTML = dataArr.join("")

    }

    var renderPage = function() {
        var num = Math.ceil(totalAmount / size)
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr.push(`<div class="page-item">${i + 1}</div>`)
        }
        paginationContainer.innerHTML = arr.join('')
        fillActive()
    }


    var fillActive = function() {
        document.querySelectorAll('.page-item').forEach(function(node) {
            node.innerHTML == page && (node.className = 'page-item active')
        })
    }




    init()
})()