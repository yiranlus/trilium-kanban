module.exports = async function(context) {
    const {
      helpers,
    } = context;
    
    const { noteId: kanbanNoteId } = api.originEntity;
    
    const descriptionData = await api.runOnBackend(kanbanNoteId => {
        const kanbanNote = api.getNote(kanbanNoteId);
        const descriptionNote = kanbanNote.getChildNotes().filter(board => {
            return board.hasLabel('kanbanDescription');
        });
        if (descriptionNote) {
            return {
                id: descriptionNote[0].noteId,
                content: descriptionNote[0].getContent()
            }
        }
    }, [kanbanNoteId]);
    
    
    $('#kanban-description').html(descriptionData.content);
    //$('#kanban-description').click(() => {
    //    helpers.navigateToNote(descriptionData.id);
    //});
    $('#kanban-description').scroll(() => {
    });
}