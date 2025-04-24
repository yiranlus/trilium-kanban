module.exports = async function() {
    const { noteId: kanbanNoteId } = api.originEntity;

    return await api.runOnBackend(kanbanNoteId => {
        const kanbanNote = api.getNote(kanbanNoteId);
        const boards = kanbanNote.getChildNotes().filter(board => {
            return !(board.hasLabel('kanbanDescription') || board.hasLabel('kanbanAttachment'));
        });;

        // sort boards by "sortOrder"
        const sortedBoards = boards.sort((a, b) => {
            const aSortOrder = a.getLabelValue("sortOrder");
            const bSortOrder = b.getLabelValue("sortOrder");
            
            return aSortOrder - bSortOrder;
        });
              
        return sortedBoards.map(board => {
            const cards = board.getChildNotes();
            
            // sort cards by "sortOrders"
            const sortedCards = cards.sort((a, b) => {
                const aSortOrder = a.getLabelValue("sortOrder");
                const bSortOrder = b.getLabelValue("sortOrder");
                
                return aSortOrder - bSortOrder;
            });

            return {
                id: board.noteId,
                title: board.title,
                iconClass: board.getLabelValue("iconClass"),
                item: sortedCards.map(card => {
					const htmlString = card.getContent();

					const checkedCount = (htmlString.match(/<input[^>]*type="checkbox"[^>]*checked[^>]*>/g) || []).length;
					const uncheckedCount = (htmlString.match(/<input[^>]*type="checkbox"(?![^>]*checked)[^>]*>/g) || []).length;
                    
                    return {
                        id: card.noteId,
                        title: card.title,
                        tags: card.getLabelValues("tag"),
                        progress: (uncheckedCount?`${checkedCount}/${uncheckedCount}`:null),
                        kanbanStyle: card.getLabelValue("kanbanStyle"),
                        iconClass: card.getLabelValue("iconClass")
                    }
                })
            };
        });
    }, [kanbanNoteId]);
}