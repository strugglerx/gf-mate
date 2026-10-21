// project_demo.go — 可选：给 project 表补中文语义标签（纯反射之上的人性化层）。
//
// 核心思路：
//  1. 默认：直接反射 entity.MiniappProject，零手写字段即可用（标签是英文/表名）。
//  2. 可选：想给 AI 更好语义，就用 dq tag 覆盖关键字段（下述 struct 镜像 entity，
//     但 dq tag 提供 label/role/type/enum）。这不是必须的——小白可完全跳过本文件。
//
// dq tag 语法：
//
//	dq:"label=中文名,role=dimension|measure,type=string|number|datetime|enum,
//	     agg=count|sum|avg|max|min,enum=值:标签|值:标签,desc=说明"   dq:"-" 跳过字段
package main

import dq "github.com/strugglerx/gf-mate"

// ProjectSemantic 带中文语义的 project 表定义（可选覆盖；字段名/orm 列名与 entity 一致）。
type ProjectSemantic struct {
	Id              string `json:"id"      orm:"id"          dq:"label=项目ID,role=measure,agg=count"`
	Name            string `json:"name"    orm:"name"        dq:"label=项目名称,role=dimension,type=string"`
	Status          string `json:"status"  orm:"status"      dq:"label=备案状态,role=dimension,type=enum,enum=pendingFill:待填报|aiReview:AI资料核查|propertyConfirm:待物业确认|streetAccept:待街道受理|siteCheck:待现场审核|rejected:已驳回|refiling:重新填报|construction:施工中|rectification:整改中|cancelled:已注销"`
	DistrictCode    string `json:"districtCode" orm:"district_code" dq:"label=行政区,role=dimension,type=enum,enum=440303000:罗湖区|440304000:福田区"`
	StreetCommunity string `json:"streetCommunity" orm:"street_community" dq:"label=街道社区,role=dimension,type=string"`
	Contractor      string `json:"contractor" orm:"contractor" dq:"label=施工单位,role=dimension,type=string"`
	ProjectType     string `json:"projectType" orm:"project_type" dq:"label=工程类型,role=dimension,type=string"`
	Risk            string `json:"risk"      orm:"risk"       dq:"label=风险等级,role=dimension,type=string"`
	IsHighRisk      int    `json:"isHighRisk" orm:"is_high_risk" dq:"label=是否高风险,role=dimension,type=number"`
	CreatedAt       any    `json:"createdAt" orm:"created_at" dq:"label=备案时间,role=dimension,type=datetime"`
}

// registerProjectSemantic 用语义化定义注册 project（可选入口）。
func registerProjectSemantic() error {
	ds, err := dq.FromStruct(&ProjectSemantic{}, func(o *dq.FromStructOptions) {
		o.Name = "project"
		o.Table = "miniapp_project"
		o.Label = "工程项目"
		o.Description = "限额以下工程备案项目主表。" +
			"status:pendingFill=待填报,aiReview=AI资料核查,propertyConfirm=待物业确认,streetAccept=待街道受理," +
			"siteCheck=待现场审核,rejected=已驳回,refiling=重新填报,construction=施工中,rectification=整改中,cancelled=已注销。" +
			"district_code:440303000=罗湖区,440304000=福田区。"
	})
	if err != nil {
		return err
	}
	return dq.Register(*ds)
}
