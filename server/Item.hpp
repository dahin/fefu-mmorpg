#pragma once

#include "Actor.hpp"
#include <QStringList>
#include <QVariant>
#include <QMap>

class Item : public Actor
{
public:
  Item();
  virtual ~Item();

  QString Getname();
  void SetName(QString str);

  int GetWeight();
  void SetWeight(int str);

  QString GetTypeItem();
  void SetTypeItem(QString str);
  void SetTypeItem(int str);

  QString GetSubtype();
  QString GetClass();

  QString GetMessage();
  void SetMessage(QString str);

  int GetTime();
  void SetTime(int str);

  void SetSubtype(QString str);

  void SetClass(QString str);

  QStringList Flags;
  QMap <Stat_const, QMap <QString, QVariant> > bonuses;
  Damage damage;

private:
  int time_;
  int weight_;
  QString name_;
  QString type_item_;
  QString class_item_;
  QString subtype_;
  QString massege_;

  std::vector<QString> class_ =
  {
    "garment",
    "consumable",

  };

  std::vector<QString> type =
  {
    "amulet",
    "ring",
    "armor",
    "shield",
    "helm",
    "gloves",
    "boots",
    "weapon",
    "expendable",
  };

  std::vector<QString> subtype =
  {
    "one-handed",
    "two-handed",
    "bow",
  };
};
