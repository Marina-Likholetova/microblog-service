const commentForms = document.querySelectorAll(".comment-form form");

commentForms.forEach(commentForm => {
    commentForm.addEventListener("submit", (e) => {
        const formData = new FormData(commentForm);
        const textareaValue = formData.get('comment');

        if (!textareaValue.trim()) {
            e.preventDefault();
            const textareaElement = commentForm.querySelector('textarea[name="comment"]');
            textareaElement.focus();
        }
    })
});