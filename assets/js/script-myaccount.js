/**
 * Iteket Timelist admin and myaccount page script file
 * All in one script file
 */
var iwoAddon = iwoAddon || {};
iwoAddon.fn = iwoAddon.fn || {};

// Define all functions
(function($) {
    iwoAddon.fn.fileTable = {
        init: function() {
            if (!$('.archived_files_table').length) {
                return;
            }
            
            $('.archived_files_table').DataTable({
                order: [
                    [0, 'desc']
                ],
                responsive: true
            });
        }
    }
})(jQuery);


// Execute on page loaded
jQuery(document).ready(function($) {
    iwoAddon.fn.fileTable.init();   
});
