<script lang="ts">
</script>

<div class="relative overflow-x-auto w-full">
	<table class="w-full text-left">
		<thead class="text-lg uppercase border-b">
			<tr class="flex gap-4 animate-pulse">
				{#each [0, 1, 2] as _}
					<th class="flex-1 py-1"> <div class="bg-base-200 w-full h-9 rounded-box" /> </th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each [0, 1, 2] as _}
				<tr class="flex gap-4 animate-pulse">
					{#each [0, 1, 2] as _}
						<td class="flex-1 py-1"> <div class="bg-base-200 w-full h-9 rounded-box" /> </td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
