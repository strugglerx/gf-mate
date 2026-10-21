package dq

import "testing"

func TestMatchExcludeTable(t *testing.T) {
	cases := []struct {
		pattern, table string
		want           bool
	}{
		{"demo", "demo", true},
		{"demo", "DEMO", true},
		{"demo", "demo2", false},
		{"miniapp_dead_%", "miniapp_dead_dep_20261016", true},
		{"miniapp_dead_%", "MINIAPP_DEAD_OBJ_X", true},
		{"miniapp_dead_%", "miniapp_project", false},
		{"%", "anything", true},
		{"", "x", false},
	}
	for _, c := range cases {
		if got := matchExcludeTable(c.pattern, c.table); got != c.want {
			t.Errorf("matchExcludeTable(%q,%q)=%v want %v", c.pattern, c.table, got, c.want)
		}
	}
}
