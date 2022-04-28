<template>
	<cu-editor ref="editor" :content="content" @intro='getText'></cu-editor>
</template>
<script>
	import cuEditor from '@/components/cu-editor/cu-editor'
	export default {
		data() {
			return {
				header: {},
				formData: {},
				content: "",
			}
		},
		components: {
			cuEditor
		},
		onShow() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('acceptDataFromOpenerPage', (data) => {
				console.log(data)
				this.content = data.data
				console.log(this.content)
			})
		},
		methods: {
			getText: function(data) {
				const eventChannel = this.getOpenerEventChannel();
				console.log("richtest2", data)
				eventChannel.emit('acceptDataFromOpenedPage', {
					data: data
				});
			}

		}
	}
</script>
