import { h } from 'vue'
import type {User} from "~/components/user/types";
import type {ColumnDef} from "@tanstack/vue-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-left' }, 'Name'),
  },
  {
    accessorKey: 'role',
    header: () => h('div', { class: 'text-right' }, 'Role'),
    cell: ({ row }) => {
      const role = row.getValue('role')

      return h('div', { class: 'text-right font-medium' }, `User has role: ${role}`)
    },
  }
]