module.exports = {
  prefix: 'j-',
	status: {
		online: 'online',
		idle: 'idle',
		invisible: 'invisible',
		dnd: 'dnd',
	},
  activity: 'Working like Slave.',
  superusers: ['322787975630946306', '322795283681509376', '372364695354736641'],
  categories: [
    {name: 'test', priority: 5}, 
    {name: 'general', priority: 8},
    {name: 'admin', priority: 1},
		{name: 'blank', priority: 8},
		{name: 'imgs', priority: 8},
		{name: 'coins', priority: 8},
		{name: 'music', priority: 5}
  ],
  groups: [
		{name: "User", permLvl: 0}, 
		{name: "Imgs", permLvl: 1},
		{name: "Mod", permLvl: 2},
		{name: "Admin", permLvl: 3}
	],
	permission: {
		0: "User",
		1: "Member",
		2: "Mod",
		3: "Admin"
	},
	language: "English",
}