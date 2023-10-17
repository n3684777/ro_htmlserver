$.ajaxSetup({
    cache: false
});

function indexNews(newsType,GameType) {

    GameType = GameType || "RO";
    apiUrl = 'api/getNewsList_v2.ashx';
    if (GameType == "ROS")
        apiUrl = "../api/getNewsList_v2.ashx";

    /*
    $.ajax({
        type: 'POST',
        dataType: 'text',
        url: apiUrl,
        data: {
            newsType: newsType,
            pageSize: 8,
            GameType: GameType,
            Site: window.location.hostname
        },
        success: function (response) {
            console.log(response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("E|" + xhr.status + '：' + thrownError);
            //    alert('消息Ajax request 發生錯誤\n' + xhr.status + '：' + thrownError);
        }
    });
    */

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: apiUrl,
        data: {
            newsType: newsType,
            pageSize: 8,
            GameType: GameType,
            Site: window.location.hostname
        },
        success: function (response) {
            //console.log(response);
            $(".on").removeClass("on");
            if (newsType == null) {
                newsType = 0;
            }
            $("#newsType" + newsType).addClass("on");

            var noticeList = ".noticeList";
            if (GameType == "ROS")
                noticeList = ".news-list";

            if (response.success) {


                $(noticeList).html("");
                var tmparr = response.news;
                for (i = 0 ; i < tmparr.length; i++) {
                    var date = new Date(tmparr[i]["publish_date"].toString());
                    var fStart = date.getFullYear() + "-" + leftZeroPad((date.getMonth() + 1), 2) + "-" + leftZeroPad(date.getDate(), 2) + " " + leftZeroPad(date.getHours(), 2) + ":" + leftZeroPad(date.getMinutes(), 2);
                    var url = 'notice/notice_view.aspx?id=' + tmparr[i]["newsId"];
                    var openNewWindow = "";
                    if (tmparr[i]["url"]) {
                        url = tmparr[i]["url"];
                        openNewWindow = 'target="_blank"';
                    }
                    var tmpstr = "<li class='" + newTypeChange(tmparr[i]["catalog"]) + "'><a href='" + url + "'" + openNewWindow + ">" + tmparr[i]["newsTitle"] + "</a><span class='date'>" + fStart + "</span></li>";
                    if (GameType == "ROS") {
                        if (!tmparr[i]["url"]) {
                            url = '../ROS/notice_view.aspx?id=' + tmparr[i]["newsId"];
                        }
                        tmpstr="<li><a href='" + url + "'" + openNewWindow + ">" + tmparr[i]["newsTitle"] + "</a></li>";
                    }
                    $(noticeList).append(tmpstr);
                }
            } else {
                $(noticeList).html("");
                var tmpstr = "<li><a>" + response.message + "</a></li>";
                $(noticeList).append(tmpstr);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("E|" + xhr.status + '：' + thrownError);
            //    alert('消息Ajax request 發生錯誤\n' + xhr.status + '：' + thrownError);
        }
    });
}

function patchNews() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../api/getNewsList.ashx',
        data: {
            pageSize: 6
        },
        success: function (response) {
            if (response.success) {
                $(".listBox").html("");
                var tmparr = response.news;
                for (i = 0 ; i < tmparr.length; i++) {
                    var date = new Date(parseInt(tmparr[i]["publish_date"].substr(6)));
                    var fStart = date.getFullYear() + "-" + leftZeroPad((date.getMonth() + 1), 2) + "-" + leftZeroPad(date.getDate(), 2);
                    var url = 'notice/notice_view.aspx?id=' + tmparr[i]["newsId"];
                    var openNewWindow = "";
                    if (tmparr[i]["url"]) {
                        url = tmparr[i]["url"];
                        openNewWindow = 'target="_blank"';
                    }
                    var tmpstr = "<a href='"+url+"'"+openNewWindow+"><div class='" + patchNewsType(tmparr[i]["catalog"]) + "'></div><div class='txt'>" + tmparr[i]["newsTitle"] + ".</div><div class='date'>" + fStart + "</div></a>";
                    $(".listBox").append(tmpstr);
                }
            } else {
                $(".listBox").html("");
                var tmpstr = "<a><div class='txt'>" + response.message + ".</div></a>";
                $(".listBox").append(tmpstr);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert("E|" + xhr.status + '：' + thrownError);
            console.log("E|" + xhr.status + '：' + thrownError);
            //    alert('消息Ajax request 發生錯誤\n' + xhr.status + '：' + thrownError);
        }
    });
}

//RO公告列表 notice_list專用
function noticeNews(newsType, page) {

    var searchKey = document.getElementById('searchTitle').value;
    $("#newsListTb").html("<tr><td colspan='3'><img src='../images/common/loading.gif'/></td></tr>");
    switch (newsType) {
        case 2:
            $("#newTypeTxt").html("活動公告");
            break;
        case 4:
            $("#newTypeTxt").html("新聞公告");
            break;
        case 6:
            $("#newTypeTxt").html("系統公告");
            break;
        case 8:
            $("#newTypeTxt").html("機率公告");
            break;
        default:
            $("#newTypeTxt").html("所有公告");
            break;
    }
    var pageSize = 20;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../api/getNewsList.ashx',
        data: {
            newsType: newsType,
            pageSize: pageSize,
            page: page,
            searchKey: searchKey,
            GameId: "RO"
        },
        success: function (response) {
            $(".on").removeClass("on");
            $("#lmNews" + newsType).addClass("on");
            if (newsType == null) {
                $("#lmNews").addClass("on");
            }
            if (response.success) {
                $("#newsListTb").html("");
                var tmparr = response.news;
                for (i = 0 ; i < tmparr.length; i++) {
                    var date = new Date(parseInt(tmparr[i]["publish_date"].substr(6)));
                    var fStart = date.getFullYear() + "-" + leftZeroPad((date.getMonth() + 1), 2) + "-" + leftZeroPad(date.getDate(), 2);
                    var url = 'notice_view.aspx?id=' + tmparr[i]["newsId"];
                    var openNewWindow = "";
                    if (tmparr[i]["url"]) {
                        url = tmparr[i]["url"];
                        openNewWindow = 'target="_blank"';
                    }
                    var tmpstr = "<tr><td>" + tmparr[i]["newsId"] + "</td><td class='textLeft'><span class='" + listNewsTypeChange(tmparr[i]["catalog"]) + "'></span><a href='"+url+"'"+openNewWindow+">" + tmparr[i]["newsTitle"] + "</a></td><td>" + fStart + "</td></tr>";
                    $("#newsListTb").append(tmpstr);
                }
                var searchKey = document.getElementById('searchTitle').value;

                //產生分頁
                $.jqPaginator('.pageing', {
                    totalCounts: response.totalCount,
                    pageSize: pageSize,
                    visiblePages: 10,
                    currentPage: page,
                    first: '<a href="javascript:noticeNews(' + newsType + ',  {{page}});"><img src="../images/sub/btn_first.gif" alt="first" /></a>',
                    last: '<a href="javascript:noticeNews(' + newsType + ', {{page}});"><img src="../images/sub/btn_last.gif" alt="last" /></a>',
                    prev: '<a href="javascript:noticeNews(' + newsType + ', {{page}});"><img src="../images/sub/btn_prev.gif" alt="prev" /></a>',
                    next: '<a href="javascript:noticeNews(' + newsType + ', {{page}});"><img src="../images/sub/btn_next.gif" alt="next" /></a>',
                    page: '<a href="javascript:noticeNews(' + newsType + ', {{page}});">{{page}}</a>'
                });
            } else {
                $("#newsListTb").html("");
                var tmpstr = "<tr><td>1</td><td class='textLeft'><span class='icoSystem'></span><a href='javascript:;'>" + response.message + "</a></td><td></td></tr>";
                $("#newsListTb").append(tmpstr);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert("E|" + xhr.status + '：' + thrownError);
            console.log("E|" + xhr.status + '：' + thrownError);
        }
    });
}

//ROS notice_list.aspx專用
function notice_News_ROS(newsType, page) {
    //如果不指定newsType 預設使用下拉選單的值
    var newsType = newsType || $("#newsType").val();
    var searchKey = document.getElementById('searchTitle').value;

    var pageSize = 20;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../api/getNewsList.ashx',
        data: {
            newsType: newsType,
            pageSize: pageSize,
            page: page,
            searchKey: searchKey,
            GameId: "ROS"
        },
        success: function (response)
        {

            if (response.success) {
                $("#newsListTb").html("");
                var tmparr = response.news;
                for (i = 0 ; i < tmparr.length; i++) {
                    var date = new Date(parseInt(tmparr[i]["publish_date"].substr(6)));
                    var fStart = date.getFullYear() + "-" + leftZeroPad((date.getMonth() + 1), 2) + "-" + leftZeroPad(date.getDate(), 2);
                    var url = 'notice_view.aspx?id=' + tmparr[i]["newsId"];
                    var openNewWindow = "";
                    if (tmparr[i]["url"]) {
                        url = tmparr[i]["url"];
                        openNewWindow = 'target="_blank"';
                    }
                    var tmpstr = "<tr><td>" + tmparr[i]["newsId"] + "</td><td class='tal'><span class='icon " + listNewsTypeChange(tmparr[i]["catalog"],"ROS") + "'></span><a href='" + url + "'" + openNewWindow + ">" + tmparr[i]["newsTitle"] + "</a></td><td>" + fStart + "</td></tr>";
                    $("#newsListTb").append(tmpstr);
                }

                //產生分頁
                $.jqPaginator('.pageing', {
                    totalCounts: response.totalCount,
                    pageSize: pageSize,
                    visiblePages: 10,
                    currentPage: page,
                    activeClass:"on",
                    first: '<li class=""><a href="javascript:notice_News_ROS(null,{{page}});"><img src="img/btn_first.gif" alt=""></a></li>',
                    last: '<li class=""><a href="javascript:notice_News_ROS(null,{{page}});"><img src="img/btn_last.gif" alt=""></a></li>',
                    prev: '<li class=""><a href="javascript:notice_News_ROS(null,{{page}});"><img src="img/btn_prev.gif" alt=""></a></li>',
                    next: '<li class=""><a href="javascript:notice_News_ROS(null,{{page}});"><img src="img/btn_next.gif" alt=""></a></li>',
                    page: '<li><a href="javascript:notice_News_ROS(null,{{page}});">{{page}}</a></li>'
                });
            } else {
                $("#newsListTb").html("");
                var tmpstr = "<tr><td>1</td><td class='textLeft'><span class='icoSystem'></span><a href='javascript:;'>" + response.message + "</a></td><td></td></tr>";
                $("#newsListTb").append(tmpstr);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert("E|" + xhr.status + '：' + thrownError);
            console.log("E|" + xhr.status + '：' + thrownError);
        }
    });
}

function newTypeChange(newsType) {
    var result = null;
    switch (newsType) {
        case "2":
            result = "icoEvent";
            break;
        case "4":
            result = "icoNew";
            break;
        case "6":
            result = "icoSystem";
            break;
        case "8":
            result = "icoChance";
            break;
    }
    return result;
}

function listNewsTypeChange(newsType, GameId) {
    GameId = GameId || "RO";
    var result = null;
    switch (newsType) {
        case "2":
            result = "icoEvent";
            if (GameId == "ROS")
                result = "iconEvent";
            break;
        case "4":
            result = "icoNews";
            if (GameId == "ROS")
                result = "iconNews";
            break;
        case "6":
            result = "icoSystem";
            if (GameId == "ROS")
                result = "iconSystem";
            break;
        case "8":
            result = "icoChance";
            if (GameId == "ROS")
                result = "iconChance";
            break;
    }
    return result;
}

function patchNewsType(newsType) {
    var result = null;
    switch (newsType) {
        case "2":
            result = "ico_event";
            break;
        case "4":
            result = "ico_new";
            break;
        case "6":
            result = "ico_system";
            break;
        case "8":
            result = "ico_chance";
            break;
    }
    return result;
}

function leftZeroPad(val, minLength) {
    var MANY_ZEROS = "000000000000000000";
    if (typeof (val) != "string")
        val = String(val);
    return (MANY_ZEROS.substring(0, minLength - val.length)) + val;
}
