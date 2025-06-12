<script setup lang="ts">
import type { User } from '@/types/user'
import DataTable from "~/components/data-table/DataTable.vue";
import {columns} from "~/components/user/users-table/columns";

const api = useApi()
const users = ref<User[]>([])

const getUsers = async () => {
  try {
    const response = await api.get<User[]>('/users')
    users.value = response
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => getUsers())
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Users</CardTitle>
      <CardDescription>View and manage users</CardDescription>
    </CardHeader>
    <CardContent>
      <DataTable :columns="columns" :data="users"/>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>