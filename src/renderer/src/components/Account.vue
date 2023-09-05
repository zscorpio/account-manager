<script>
export default {
	data() {
		return {
			accountConfig: [],
			accountInfo: {},
			pagination: { pageSize: 30 },
			columns: [],
			normalcolumns: [
				{
					title: "账号",
					dataIndex: "account"
				},
				{
					title: "备注",
					dataIndex: "remark"
				},
				{
					title: "操作",
					slotName: "normalOperation"
				}
			],
			openAIColumns: [
				{
					title: "账号",
					dataIndex: "account"
				},
				// {
				// 	title: "密码",
				// 	dataIndex: "password"
				// },
				{
					title: "备注",
					dataIndex: "remark"
				},
				{
					title: "数据",
					slotName: "data"
				},
				{
					title: "最后更新时间",
					slotName: "lastUpdateTime"
				},
				{
					title: "操作",
					slotName: "operation"
				}
			]
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData: async function () {
			const accountConfig = await window.request.invoke(window.API.data.getAccountList, "");
			this.accountConfig = accountConfig;
			this.accountInfo = accountConfig[0];
			if (this.accountInfo.type === "openai") {
				this.columns = this.openAIColumns;
			} else {
				this.columns = this.normalcolumns;
			}
		},
		changeAccountType: async function (index) {
			this.accountInfo = this.accountConfig[index];
			if (this.accountInfo.type === "openai") {
				this.columns = this.openAIColumns;
			} else {
				this.columns = this.normalcolumns;
			}
		},
		updateData: async function (data) {
			await window.request.invoke(window.API.data.updateData, data);
			location.reload();
		},
		openHomePage: async function (data) {
			window.request.invoke(window.API.data.openHomePage, data);
		},
		timestampFormat: function (timestamp) {
			function zeroize(num) {
				return (String(num).length === 1 ? "0" : "") + num;
			}

			const curTimestamp = parseInt(new Date().getTime() / 1000 + ""); //当前时间戳
			const timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
			const curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
			const tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象
			const Y = tmDate.getFullYear(),
				m = tmDate.getMonth() + 1,
				d = tmDate.getDate();
			const H = tmDate.getHours(),
				i = tmDate.getMinutes();
			if (timestampDiff < 60) {
				// 一分钟以内
				return "刚刚";
			} else if (timestampDiff < 3600) {
				// 一小时前之内
				return Math.floor(timestampDiff / 60) + "分钟前";
			} else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
				return "今天" + zeroize(H) + ":" + zeroize(i);
			} else {
				const newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
				if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
					return "昨天" + zeroize(H) + ":" + zeroize(i);
				} else if (curDate.getFullYear() === Y) {
					return zeroize(m) + "月" + zeroize(d) + "日 " + zeroize(H) + ":" + zeroize(i);
				} else {
					return Y + "年" + zeroize(m) + "月" + zeroize(d) + "日 " + zeroize(H) + ":" + zeroize(i);
				}
			}
		}
	}
};
</script>

<template>
	<div class="account-manager">
		<a-radio-group v-model="accountInfo.name" type="button" style="margin-bottom: 10px" size="large">
			<a-radio
				v-for="(accountType, index) in accountConfig"
				:key="accountType.name"
				:value="accountType.name"
				@click="changeAccountType(index)"
				>{{ accountType.name }}
			</a-radio>
		</a-radio-group>
		<a-table :columns="columns" :data="accountInfo.accountList" class="account-table" :pagination="pagination">
			<template #lastUpdateTime="{ record }">
				<span v-if="record.lastUpdateTime">{{ timestampFormat(record.lastUpdateTime) }}</span>
				<span v-else>从未更新</span>
			</template>
			<template #data="{ record }">
				<div v-if="record.data && record.data.type === 'openai'">
					<a-progress :percent="record.data.percent - 0">
						<template v-slot:text="scope">
							剩{{ record.data.left }}刀({{ (scope.percent * 100).toFixed(2) }}%)
						</template>
					</a-progress>
				</div>
				<div v-else>
					{{ JSON.stringify(record.data) }}
				</div>
			</template>
			<template #operation="{ record }">
				<a-button type="primary" @click="openHomePage({ uniqueId: record.uniqueId })"> 打开</a-button>
				<a-button
					type="primary"
					status="success"
					style="margin-left: 10px"
					@click="updateData({ uniqueId: record.uniqueId })"
				>
					更新
				</a-button>
			</template>
			<template #normalOperation="{ record }">
				<a-button type="primary" @click="openHomePage({ uniqueId: record.uniqueId })"> 打开</a-button>
			</template>
		</a-table>
	</div>
</template>

<style lang="less">
.account-manager {
	box-sizing: border-box;
	width: 100%;
	padding: 40px;
	//background-color: var(--color-neutral-2);
}

.account-table {
	width: 100%;
}
</style>
