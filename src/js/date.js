import { format } from "date-fns";


function formatTodoDate(date) {
    return format(new Date(date), "MMMM d");
}


export { formatTodoDate };