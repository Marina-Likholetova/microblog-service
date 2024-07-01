document.querySelectorAll('.post__service .delete-btn').forEach(btn => {
    btn.addEventListener("click", (e) => {
        const { id } = e.target.dataset;

        const api = `/api/posts/${id}`;

        fetch(api, {
            method: "DELETE",
        })
            .then(() => {
                window.location.href = "/blog/my-posts";
            })
            .catch((err) => console.log("error: ", err.message));
    })
});

document.querySelectorAll(".comment__service .delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const { id } = e.target.dataset;
        const url = window.location.href;

        const api = `/api/comments/${id}`;

        fetch(api, {
            method: "DELETE",
        })
            .then(() => {
                window.location.href = url;
            })
            .catch((err) => console.log("error: ", err.message));
    })
});


document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const menu = this.nextElementSibling;
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        } else {
            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
            menu.style.display = 'block';
        }
        e.stopPropagation();
    });
});

document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
});

document.querySelectorAll(".user__service .delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const { id } = e.target.dataset;
        const url = window.location.href;

        const api = `/api/users/${id}`;

        fetch(api, {
            method: "DELETE",
        })
            .then(() => {
                window.location.href = url;
            })
            .catch((err) => console.log("error: ", err.message));
    })
});