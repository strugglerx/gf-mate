package dq

import (
	"strings"
	"testing"
)

func TestDefaultConfig(t *testing.T) {
	cfg := DefaultConfig()
	if cfg.Mode != "whitelist" {
		t.Fatalf("DefaultConfig().Mode = %q, want whitelist", cfg.Mode)
	}
	if cfg.RawSQL.Enabled == nil || !*cfg.RawSQL.Enabled {
		t.Fatal("DefaultConfig().RawSQL.Enabled should default to true")
	}
	if len(cfg.Render.EnabledTypes) != 5 {
		t.Fatalf("DefaultConfig().Render.EnabledTypes = %v, want 5 types", cfg.Render.EnabledTypes)
	}
}

func TestNormalizeNil(t *testing.T) {
	cfg, err := (*Config)(nil).normalize()
	if err != nil {
		t.Fatalf("normalize(nil) error = %v", err)
	}
	if cfg.Mode != "whitelist" {
		t.Fatalf("normalize(nil).Mode = %q, want whitelist", cfg.Mode)
	}
}

func TestNormalizeInvalidMode(t *testing.T) {
	cfg := &Config{Mode: "hack"}
	_, err := cfg.normalize()
	if err == nil {
		t.Fatal("normalize() invalid mode should error")
	}
	if !strings.Contains(err.Error(), "mode") {
		t.Fatalf("normalize() error = %v, want mention mode", err)
	}
}

func TestNormalizeDefaults(t *testing.T) {
	cfg := &Config{Mode: "all"}
	norm, err := cfg.normalize()
	if err != nil {
		t.Fatalf("normalize() error = %v", err)
	}
	if norm.RawSQL.MaxRows != 500 {
		t.Fatalf("normalize().RawSQL.MaxRows = %d, want 500", norm.RawSQL.MaxRows)
	}
	if norm.RawSQL.TimeoutSec != 30 {
		t.Fatalf("normalize().RawSQL.TimeoutSec = %d, want 30", norm.RawSQL.TimeoutSec)
	}
	// 显式关闭 RawSQL 应保留 false。
	bFalse := false
	cfg2 := &Config{Mode: "whitelist", RawSQL: RawSQLConfig{Enabled: &bFalse}}
	norm2, err := cfg2.normalize()
	if err != nil {
		t.Fatalf("normalize() error = %v", err)
	}
	if norm2.RawSQL.Enabled == nil || *norm2.RawSQL.Enabled {
		t.Fatal("explicit RawSQL disable should stay false")
	}
}
